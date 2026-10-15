import crypto from 'crypto'
import mongoose from 'mongoose'
import Order from '../model/order.model.js'
import Customer from '../model/customer.model.js'
import Product from '../model/product.model.js'
import { getRazorpayInstance } from '../config/razorpay.js'

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' })
    }

    const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress

    if (!fullName?.trim() || !phone?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
      return res.status(400).json({ message: 'All shipping address fields are required and cannot be empty' })
    }

    const cleanPhone = phone.trim().replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return res.status(400).json({ message: 'Phone number must contain at least 10 digits' })
    }

    const cleanPincode = pincode.trim()
    if (!/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).json({ message: 'Pincode must contain exactly 6 digits' })
    }

    const customer = await Customer.findById(req.customer._id)
    if (!customer) {
      return res.status(401).json({ message: 'Customer not found' })
    }

    const rawCart = customer.cart || []
    if (rawCart.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' })
    }

    const productIds = rawCart.map((item) => item.product).filter(Boolean)
    const products = await Product.find({ _id: { $in: productIds } })
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))

    // Automatically prune any deleted/stale products from the customer's cart
    const validCart = rawCart.filter((item) => item.product && productMap.has(item.product.toString()))
    if (validCart.length !== rawCart.length) {
      customer.cart = validCart
      await customer.save()
    }

    if (validCart.length === 0) {
      return res.status(400).json({ message: 'The items in your cart are no longer available' })
    }

    const orderItems = []
    let calculatedTotal = 0

    for (const item of validCart) {
      const productIdStr = item.product.toString()
      const product = productMap.get(productIdStr)

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`,
        })
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image || '',
      })

      calculatedTotal += Number(product.price) * Number(item.quantity)
    }

    const shopKartOrder = new Order({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: cleanPincode,
      },
      totalAmount: calculatedTotal,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    })

    await shopKartOrder.save()

    const amountInPaise = Math.round(calculatedTotal * 100)
    let razorpayOrderId = `order_${shopKartOrder._id.toString()}_${Date.now()}`

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const razorpay = getRazorpayInstance()
        const rzpOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: shopKartOrder._id.toString(),
        })
        razorpayOrderId = rzpOrder.id
      } catch (err) {
        console.error('Error creating Razorpay order:', err.message)
        return res.status(502).json({
          message: 'Unable to initiate Razorpay payment order',
          error: err.message,
        })
      }
    }

    shopKartOrder.razorpayOrderId = razorpayOrderId
    await shopKartOrder.save()

    return res.status(200).json({
      success: true,
      shopKartOrderId: shopKartOrder._id.toString(),
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to process checkout', error: error.message })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!shopKartOrderId || !razorpay_payment_id) {
      return res.status(400).json({ message: 'Missing required payment verification details' })
    }

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({ message: 'Invalid order ID' })
    }

    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: req.customer._id,
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(200).json({
        success: true,
        message: 'Order already verified and paid',
        order,
      })
    }

    let isSignatureValid = false

    if (process.env.RAZORPAY_KEY_SECRET) {
      const trustedOrderId = order.razorpayOrderId || razorpay_order_id
      const body = trustedOrderId + '|' + razorpay_payment_id

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex')

      isSignatureValid = (expectedSignature === razorpay_signature)
    } else {
      // In mock/test environment when real secret is not configured
      isSignatureValid = Boolean(
        razorpay_signature === 'mock_valid_signature' ||
        (razorpay_signature && razorpay_signature.length >= 10)
      )
    }

    if (!isSignatureValid) {
      order.paymentStatus = 'FAILED'
      await order.save()
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment could not be verified.',
      })
    }

    // Decrement stock for purchased products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      })
    }

    order.paymentStatus = 'PAID'
    order.status = 'PLACED'
    order.razorpayPaymentId = razorpay_payment_id
    await order.save()

    // Clear user cart only after confirmed payment
    const customer = await Customer.findById(req.customer._id)
    if (customer) {
      customer.cart = []
      await customer.save()
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully and order placed',
      order,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to verify payment', error: error.message })
  }
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.customer._id }).sort({ createdAt: -1 })
    return res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch orders', error: error.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.user.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this order' })
    }

    return res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch order', error: error.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['PENDING_PAYMENT', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    await order.save()

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update order status', error: error.message })
  }
}

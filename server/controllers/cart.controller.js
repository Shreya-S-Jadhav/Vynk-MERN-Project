import mongoose from 'mongoose'
import Customer from '../model/customer.model.js'
import Product from '../model/product.model.js'

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const customer = await Customer.findById(req.customer._id)
        if (!customer) {
            return res.status(401).json({ message: 'Customer not found' })
        }

        if (!customer.cart) {
            customer.cart = []
        }

        const existingIndex = customer.cart.findIndex(
            (item) => item.product && item.product.toString() === productId
        )

        if (existingIndex > -1) {
            const nextQuantity = customer.cart[existingIndex].quantity + 1
            if (nextQuantity > product.stock) {
                return res.status(400).json({
                    message: `Cannot add more. Available stock is ${product.stock}`
                })
            }
            customer.cart[existingIndex].quantity = nextQuantity
        } else {
            if (product.stock < 1) {
                return res.status(400).json({ message: 'Product is currently out of stock' })
            }
            customer.cart.push({ product: productId, quantity: 1 })
        }

        await customer.save()
        await customer.populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        const activeCart = customer.cart.filter((item) => item.product)
        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: activeCart
        })
    } catch (error) {
        return res.status(500).json({ message: 'Unable to add product to cart', error: error.message })
    }
}

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id).populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        if (!customer) {
            return res.status(401).json({ message: 'Customer not found' })
        }

        const activeCart = (customer.cart || []).filter((item) => item.product)
        return res.status(200).json({
            success: true,
            cart: activeCart
        })
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch cart', error: error.message })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }

        const parsedQuantity = Number(quantity)
        if (Number.isNaN(parsedQuantity) || parsedQuantity < 1 || !Number.isInteger(parsedQuantity)) {
            return res.status(400).json({ message: 'Quantity must be an integer of at least 1' })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const customer = await Customer.findById(req.customer._id)
        if (!customer) {
            return res.status(401).json({ message: 'Customer not found' })
        }

        if (!customer.cart) {
            customer.cart = []
        }

        const existingIndex = customer.cart.findIndex(
            (item) => item.product && item.product.toString() === productId
        )

        if (existingIndex === -1) {
            return res.status(404).json({ message: 'Product is not in your cart' })
        }

        if (parsedQuantity > product.stock) {
            return res.status(400).json({
                message: `Requested quantity exceeds available stock (${product.stock})`
            })
        }

        customer.cart[existingIndex].quantity = parsedQuantity
        await customer.save()

        await customer.populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        const activeCart = customer.cart.filter((item) => item.product)
        return res.status(200).json({
            success: true,
            message: 'Cart quantity updated',
            cart: activeCart
        })
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update quantity', error: error.message })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }

        const customer = await Customer.findById(req.customer._id)
        if (!customer) {
            return res.status(401).json({ message: 'Customer not found' })
        }

        if (!customer.cart) {
            customer.cart = []
        }

        const existingIndex = customer.cart.findIndex(
            (item) => item.product && item.product.toString() === productId
        )

        if (existingIndex === -1) {
            return res.status(404).json({ message: 'Product is not in your cart' })
        }

        customer.cart.splice(existingIndex, 1)
        await customer.save()

        await customer.populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        const activeCart = customer.cart.filter((item) => item.product)
        return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: activeCart
        })
    } catch (error) {
        return res.status(500).json({ message: 'Unable to remove product from cart', error: error.message })
    }
}

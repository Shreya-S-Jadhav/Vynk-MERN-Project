import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createPaymentOrderApi, verifyPaymentApi } from '../axiosCalls/orderApi.js'
import { loadRazorpayScript } from '../utils/razorpay.js'
import Navbar from '../components/Navbar.jsx'

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`

const formFields = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Aarav Sharma' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9876543210' },
  { name: 'addressLine1', label: 'Delivery Address', type: 'text', placeholder: '22 MG Road, Indiranagar' },
  { name: 'city', label: 'City', type: 'text', placeholder: 'Bengaluru', inline: true },
  { name: 'state', label: 'State', type: 'text', placeholder: 'Karnataka', inline: true },
  { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '560001', maxLength: 6, inline: true },
]

function Checkout() {
  const { cartItems, cartLoading, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ error: '', status: '' })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        fullName: prev.fullName || user.fullName || '',
        phone: prev.phone || user.phone || '',
        addressLine1: prev.addressLine1 || user.shippingAddress?.street || '',
        city: prev.city || user.shippingAddress?.city || '',
        state: prev.state || user.shippingAddress?.country || '',
        pincode: prev.pincode || user.shippingAddress?.postalCode || '',
      }))
    }
  }, [user])

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full Name is required'
    if (form.phone.trim().replace(/\D/g, '').length < 10) errs.phone = 'Valid 10-digit phone required'
    if (!form.addressLine1.trim()) errs.addressLine1 = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.state.trim()) errs.state = 'State is required'
    if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = '6-digit pincode required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleVerify = async (shopKartOrderId, rzpResponse) => {
    setFeedback({ error: '', status: 'Verifying payment with server...' })
    try {
      const res = await verifyPaymentApi({
        shopKartOrderId,
        razorpay_order_id: rzpResponse.razorpay_order_id,
        razorpay_payment_id: rzpResponse.razorpay_payment_id,
        razorpay_signature: rzpResponse.razorpay_signature,
      })
      if (res.success) {
        clearCart()
        navigate(`/order-success/${shopKartOrderId}`)
      } else {
        setFeedback({ error: res.message || 'Payment verification failed', status: '' })
      }
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Payment verification failed', status: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (cartItems.length === 0) return setFeedback({ error: 'Cart is empty', status: '' })

    setSubmitting(true)
    setFeedback({ error: '', status: 'Preparing payment order...' })

    try {
      const orderData = await createPaymentOrderApi(form)
      const { shopKartOrderId, razorpayOrderId, amount, currency, key } = orderData

      const isLoaded = await loadRazorpayScript()
      if (!isLoaded || !window.Razorpay) {
        setFeedback({ error: '', status: 'Simulating test payment...' })
        setTimeout(() => handleVerify(shopKartOrderId, {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'mock_valid_signature',
        }), 1000)
        return
      }

      const rzp = new window.Razorpay({
        key,
        amount,
        currency: currency || 'INR',
        name: 'Vynk',
        description: 'Order Checkout',
        order_id: razorpayOrderId,
        prefill: { name: form.fullName, contact: form.phone, email: user?.email || '' },
        theme: { color: '#4f46e5' },
        handler: (res) => handleVerify(shopKartOrderId, res),
      })

      rzp.on('payment.failed', (fail) => {
        setSubmitting(false)
        setFeedback({ error: fail.error?.description || 'Payment failed. Cart preserved.', status: '' })
      })
      rzp.open()
      setFeedback({ error: '', status: 'Awaiting payment completion...' })
    } catch (err) {
      setSubmitting(false)
      setFeedback({ error: err.response?.data?.message || 'Unable to proceed to checkout', status: '' })
    }
  }

  const renderInput = (field) => (
    <div className="vynk-form-field" key={field.name}>
      <label htmlFor={field.name} className="vynk-field-label">{field.label}</label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        value={form[field.name]}
        onChange={(e) => {
          setForm({ ...form, [field.name]: e.target.value })
          if (errors[field.name]) setErrors({ ...errors, [field.name]: '' })
        }}
        className={`vynk-field-input ${errors[field.name] ? 'input-error' : ''}`}
        disabled={submitting}
      />
      {errors[field.name] && <span className="vynk-field-error-text">{errors[field.name]}</span>}
    </div>
  )

  if (cartLoading) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading checkout session...</p>
          </div>
        </main>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>You cannot proceed to checkout with an empty shopping bag.</p>
            <Link to="/products" className="vynk-btn-primary">
              Browse Products →
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="vynk-page-wrapper">
      <Navbar />

      <main className="vynk-main-container">
        <header className="vynk-catalog-header">
          <div>
            <div className="vynk-greeting-badge">Secure Checkout</div>
            <h1 className="vynk-page-title">
              Complete your <span>purchase.</span>
            </h1>
            <p className="vynk-page-desc">Enter your delivery address and pay securely with Razorpay Test Mode.</p>
          </div>
        </header>

        {feedback.error && <div className="vynk-alert-error" style={{ marginBottom: '20px' }}>{feedback.error}</div>}
        {feedback.status && <div className="vynk-alert-success" style={{ marginBottom: '20px' }}>{feedback.status}</div>}

        <div className="vynk-checkout-layout">
          <form className="vynk-checkout-form-card" onSubmit={handleSubmit} noValidate>
            <h2 className="vynk-form-section-title">Shipping Address</h2>
            <div className="vynk-form-stack">
              {formFields.filter((f) => !f.inline).map(renderInput)}
              <div className="vynk-form-row-tri">
                {formFields.filter((f) => f.inline).map(renderInput)}
              </div>
            </div>

            <button type="submit" className="vynk-btn-primary vynk-btn-lg vynk-btn-block" style={{ marginTop: '24px' }} disabled={submitting}>
              {submitting ? 'Processing Payment...' : 'Pay with Razorpay →'}
            </button>
          </form>

          <aside className="vynk-cart-summary-card">
            <h3 className="vynk-summary-heading">Order Items ({cartItems.length})</h3>

            <div className="vynk-checkout-items-scroll">
              {cartItems.map((item) => item.product && (
                <div className="vynk-checkout-item-row" key={item.product._id}>
                  <img src={item.product.image} alt={item.product.name} className="vynk-checkout-item-img" />
                  <div className="vynk-checkout-item-details">
                    <h4>{item.product.name}</h4>
                    <span className="vynk-checkout-item-sub">Qty: {item.quantity} × {formatPrice(item.product.price)}</span>
                  </div>
                  <strong className="vynk-checkout-item-total">{formatPrice(item.product.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="vynk-summary-divider" />

            <div className="vynk-summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="vynk-summary-row">
              <span>Express Delivery</span>
              <span className="vynk-badge-free">FREE</span>
            </div>

            <div className="vynk-summary-divider" />

            <div className="vynk-summary-row vynk-summary-grand">
              <span>Total to Pay</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="vynk-summary-assurance">
              🔒 256-bit SSL Encrypted • Razorpay Test Mode
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Checkout

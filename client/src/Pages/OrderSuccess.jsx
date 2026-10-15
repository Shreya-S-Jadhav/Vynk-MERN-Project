import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchOrderByIdApi } from '../axiosCalls/orderApi.js'
import Navbar from '../components/Navbar.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const loadOrder = async () => {
      try {
        const data = await fetchOrderByIdApi(id)
        if (active) setOrder(data)
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Unable to load order details.')
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) loadOrder()
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading confirmed order details...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="vynk-page-wrapper">
      <Navbar />

      <main className="vynk-main-container">
        <div className="vynk-success-card-wrapper">
          <div className="vynk-success-header">
            <div className="vynk-success-check-badge">✓</div>
            <span className="vynk-greeting-badge" style={{ color: '#059669', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              Payment Verified & Processed
            </span>
            <h1 className="vynk-page-title" style={{ marginTop: '12px' }}>
              Order Confirmed<span>!</span>
            </h1>
            <p className="vynk-page-desc">
              Thank you for shopping with Vynk. Your order has been placed and is being prepped for dispatch.
            </p>
          </div>

          <div className="vynk-receipt-box">
            <div className="vynk-receipt-meta-grid">
              <div className="vynk-receipt-meta-col">
                <span className="vynk-field-label">Order Number</span>
                <strong>#{order?._id || id}</strong>
              </div>
              <div className="vynk-receipt-meta-col">
                <span className="vynk-field-label">Date</span>
                <strong>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}</strong>
              </div>
              <div className="vynk-receipt-meta-col">
                <span className="vynk-field-label">Payment</span>
                <span className="vynk-status-pill status-paid">{order?.paymentStatus || 'PAID'}</span>
              </div>
              <div className="vynk-receipt-meta-col">
                <span className="vynk-field-label">Status</span>
                <span className="vynk-status-pill status-placed">{order?.status || 'PLACED'}</span>
              </div>
            </div>

            {order?.shippingAddress && (
              <div className="vynk-receipt-section">
                <h4>Shipping Address</h4>
                <p>
                  <strong>{order.shippingAddress.fullName}</strong> • {order.shippingAddress.phone}<br />
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </p>
              </div>
            )}

            {order?.items && order.items.length > 0 && (
              <div className="vynk-receipt-section">
                <h4>Items Ordered ({order.items.length})</h4>
                <div className="vynk-receipt-items-list">
                  {order.items.map((item, idx) => (
                    <div className="vynk-receipt-item-row" key={idx}>
                      {item.image && <img src={item.image} alt={item.name} />}
                      <div className="vynk-receipt-item-details">
                        <strong>{item.name}</strong>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="vynk-receipt-item-price">
                        {formatPrice(Number(item.price) * Number(item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="vynk-summary-divider" />

            <div className="vynk-receipt-total-row">
              <span>Total Amount Paid</span>
              <strong>{formatPrice(order?.totalAmount || 0)}</strong>
            </div>
          </div>

          <div className="vynk-success-actions">
            <Link to="/orders" className="vynk-btn-primary vynk-btn-lg">
              View All Orders →
            </Link>
            <Link to="/products" className="vynk-btn-secondary vynk-btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderSuccess

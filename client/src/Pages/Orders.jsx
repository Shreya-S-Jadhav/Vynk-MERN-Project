import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrdersApi, updateOrderStatusApi } from '../axiosCalls/orderApi.js'
import Navbar from '../components/Navbar.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchOrdersApi()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const sequence = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
    const currentIndex = sequence.indexOf(currentStatus)
    if (currentIndex === -1 || currentIndex === sequence.length - 1) return

    const nextStatus = sequence[currentIndex + 1]
    setUpdatingId(orderId)
    try {
      await updateOrderStatusApi(orderId, nextStatus)
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
      )
    } catch {
      // Ignored
    } finally {
      setUpdatingId('')
    }
  }

  if (loading) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading your order history...</p>
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
            <div className="vynk-greeting-badge">Purchase History</div>
            <h1 className="vynk-page-title">
              Your <span>Orders.</span>
            </h1>
            <p className="vynk-page-desc">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed with Vynk.
            </p>
          </div>
        </header>

        {error && (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">⚠️</span>
            <h3>Unable to load orders</h3>
            <p>{error}</p>
            <button type="button" className="vynk-btn-secondary" onClick={loadOrders}>
              Try Again
            </button>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">📦</span>
            <h3>No orders found</h3>
            <p>You haven't completed any purchases yet. Your confirmed orders will show up here.</p>
            <Link to="/products" className="vynk-btn-primary">
              Explore Products →
            </Link>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="vynk-orders-stack">
            {orders.map((order) => {
              const isUpdating = updatingId === order._id

              return (
                <article className="vynk-order-card" key={order._id}>
                  <header className="vynk-order-card-header">
                    <div className="vynk-order-meta-group">
                      <span className="vynk-field-label">Order Placed</span>
                      <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                    </div>

                    <div className="vynk-order-meta-group">
                      <span className="vynk-field-label">Total Amount</span>
                      <strong>{formatPrice(order.totalAmount)}</strong>
                    </div>

                    <div className="vynk-order-meta-group">
                      <span className="vynk-field-label">Ship To</span>
                      <span>{order.shippingAddress?.fullName || 'Customer'}</span>
                    </div>

                    <div className="vynk-order-meta-right">
                      <span className="vynk-field-label">Order #{order._id}</span>
                      <div className="vynk-pills-row">
                        <span className={`vynk-status-pill status-${order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                        <span className="vynk-status-pill status-paid">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </header>

                  <div className="vynk-order-card-body">
                    <div className="vynk-order-items-grid">
                      {(order.items || []).map((item, idx) => (
                        <div className="vynk-order-item-chip" key={idx}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="vynk-order-thumb" />
                          ) : (
                            <div className="vynk-order-thumb-empty">📦</div>
                          )}
                          <div className="vynk-order-item-desc">
                            <h4>{item.name}</h4>
                            <span>Qty: {item.quantity} • {formatPrice(item.price)} each</span>
                          </div>
                          <strong className="vynk-order-item-line-total">
                            {formatPrice(Number(item.price) * Number(item.quantity))}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <footer className="vynk-order-card-footer">
                      <p className="vynk-order-address-text">
                        <strong>Delivering to:</strong> {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>

                      <div className="vynk-order-actions-row">
                        {order.status !== 'DELIVERED' && order.status !== 'PENDING_PAYMENT' && (
                          <button
                            type="button"
                            className="vynk-advance-btn"
                            disabled={isUpdating}
                            onClick={() => handleAdvanceStatus(order._id, order.status)}
                          >
                            {isUpdating ? 'Updating...' : 'Advance Status →'}
                          </button>
                        )}
                        <Link to="/products" className="vynk-btn-secondary vynk-btn-sm">
                          Buy Again
                        </Link>
                      </div>
                    </footer>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Orders

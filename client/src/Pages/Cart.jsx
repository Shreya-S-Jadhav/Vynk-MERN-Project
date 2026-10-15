import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Navbar from '../components/Navbar.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function Cart() {
  const { cartItems, cartLoading, cartError, subtotal, updateQuantity, removeFromCart, refreshCart } = useCart()
  const [updatingQtyId, setUpdatingQtyId] = useState('')
  const [removingId, setRemovingId] = useState('')
  const [actionError, setActionError] = useState('')
  const navigate = useNavigate()

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (!productId || nextQuantity < 1) return
    setActionError('')
    setUpdatingQtyId(productId)
    try {
      await updateQuantity(productId, nextQuantity)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update quantity.')
    } finally {
      setUpdatingQtyId('')
    }
  }

  const handleRemove = async (productId) => {
    setActionError('')
    setRemovingId(productId)
    try {
      await removeFromCart(productId)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to remove product.')
    } finally {
      setRemovingId('')
    }
  }

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)

  if (cartLoading) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading your shopping bag...</p>
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
            <div className="vynk-greeting-badge">Your Bag</div>
            <h1 className="vynk-page-title">
              Shopping <span>Cart.</span>
            </h1>
            <p className="vynk-page-desc">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart. Review and proceed to checkout.
            </p>
          </div>
        </header>

        {actionError && <div className="vynk-alert-error" style={{ marginBottom: '20px' }}>{actionError}</div>}
        {cartError && (
          <div className="vynk-alert-error" style={{ marginBottom: '20px' }}>
            {cartError} <button type="button" onClick={refreshCart} style={{ textDecoration: 'underline', marginLeft: '8px' }}>Retry</button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">🛍️</span>
            <h3>Your cart is empty</h3>
            <p>Explore our products and find something exceptional to add.</p>
            <Link to="/products" className="vynk-btn-primary">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="vynk-cart-layout">
            <section className="vynk-cart-items-column">
              {cartItems.map((item) => {
                const product = item.product
                if (!product) return null
                const isUpdatingQty = updatingQtyId === product._id
                const isRemoving = removingId === product._id
                const lineTotal = Number(product.price || 0) * Number(item.quantity || 0)

                return (
                  <article className="vynk-cart-row-card" key={product._id}>
                    <Link to={`/products/${product._id}`} className="vynk-cart-thumb-wrap">
                      <img src={product.image} alt={product.name} />
                    </Link>

                    <div className="vynk-cart-row-info">
                      <div className="vynk-cart-row-header">
                        <div>
                          <span className="vynk-card-category">{product.category}</span>
                          <Link to={`/products/${product._id}`}>
                            <h3 className="vynk-cart-row-title">{product.name}</h3>
                          </Link>
                        </div>
                        <span className="vynk-cart-row-unit-price">{formatPrice(product.price)}</span>
                      </div>

                      <div className="vynk-cart-row-controls">
                        <div className="vynk-stepper">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) - 1)}
                            disabled={item.quantity <= 1 || isUpdatingQty || isRemoving}
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="vynk-stepper-val">{isUpdatingQty ? '...' : item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) + 1)}
                            disabled={isUpdatingQty || isRemoving || item.quantity >= (product.stock || 0)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="vynk-cart-row-total-group">
                          <span className="vynk-cart-line-label">Total:</span>
                          <strong className="vynk-cart-line-price">{formatPrice(lineTotal)}</strong>
                        </div>

                        <button
                          type="button"
                          className="vynk-cart-remove-btn"
                          onClick={() => handleRemove(product._id)}
                          disabled={isRemoving || isUpdatingQty}
                        >
                          {isRemoving ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside className="vynk-cart-summary-card">
              <h3 className="vynk-summary-heading">Order Summary</h3>

              <div className="vynk-summary-row">
                <span>Items Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="vynk-summary-row">
                <span>Shipping</span>
                <span className="vynk-badge-free">FREE</span>
              </div>

              <div className="vynk-summary-row">
                <span>Estimated Tax</span>
                <span>Included</span>
              </div>

              <div className="vynk-summary-divider" />

              <div className="vynk-summary-row vynk-summary-grand">
                <span>Total Amount</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <button
                type="button"
                className="vynk-btn-primary vynk-btn-lg vynk-btn-block"
                style={{ marginTop: '20px' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <div className="vynk-summary-assurance">
                🔒 Safe & secure encrypted payments with Razorpay
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default Cart
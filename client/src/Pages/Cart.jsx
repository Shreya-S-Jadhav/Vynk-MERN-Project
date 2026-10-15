import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import WishlistNavLink from '../components/WishlistNavLink.jsx'
import CartNavLink from '../components/CartNavLink.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function Cart() {
  const { cartItems, cartLoading, cartError, subtotal, updateQuantity, removeFromCart, refreshCart } = useCart()
  const [updatingId, setUpdatingId] = useState('')
  const [actionError, setActionError] = useState('')
  const navigate = useNavigate()

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (!productId || nextQuantity < 1) return
    setActionError('')
    setUpdatingId(productId)
    try {
      await updateQuantity(productId, nextQuantity)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update item quantity.')
    } finally {
      setUpdatingId('')
    }
  }

  const handleRemove = async (productId) => {
    setActionError('')
    setUpdatingId(productId)
    try {
      await removeFromCart(productId)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to remove product from cart.')
    } finally {
      setUpdatingId('')
    }
  }

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)

  if (cartLoading) {
    return <main className="catalog-page route-state">Loading your cart...</main>
  }

  if (cartError) {
    return (
      <main className="catalog-page catalog-state catalog-error">
        <div>
          <p>{cartError}</p>
          <button type="button" className="catalog-retry" onClick={() => refreshCart()}>Try Again</button>
        </div>
      </main>
    )
  }

  return (
    <main className="wishlist-page shop-home">
      <nav className="site-nav home-nav" aria-label="Cart navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="nav-actions">
          <Link className="nav-link" to="/products">Products</Link>
          <WishlistNavLink />
          <CartNavLink />
          <Link className="nav-link" to="/profile">Account</Link>
        </div>
      </nav>

      <section className="wishlist-content cart-content">
        <div className="home-heading">
          <p className="eyebrow">YOUR CART</p>
          <h1>Ready to checkout<span>.</span></h1>
          <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag.</p>
        </div>

        {actionError && (
          <div className="wishlist-feedback wishlist-feedback-error" style={{ marginBottom: '1.5rem', display: 'block' }} role="alert">
            {actionError}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="wishlist-empty cart-empty">
            <span className="wishlist-empty-icon" aria-hidden="true">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link className="button button-accent" to="/products">Browse products <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel">
              {cartItems.map((item) => {
                const product = item.product
                if (!product) return null

                const isUpdating = updatingId === product._id
                const lineTotal = Number(product.price || 0) * Number(item.quantity || 0)

                return (
                  <article className="cart-item-card" key={product._id}>
                    <Link className="wishlist-image-wrap cart-image-wrap" to={`/products/${product._id}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <div>
                          <p className="catalog-product-category">{product.category}</p>
                          <h2>{product.name}</h2>
                        </div>
                        <div className="cart-price-unit">
                          <strong>{formatPrice(product.price)}</strong>
                        </div>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            aria-label={`Decrease quantity of ${product.name}`}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) + 1)}
                            disabled={isUpdating || item.quantity >= (product.stock || 0)}
                            aria-label={`Increase quantity of ${product.name}`}
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-line-total">
                          <span>Total: </span>
                          <strong>{formatPrice(lineTotal)}</strong>
                        </div>
                        <button
                          type="button"
                          className="wishlist-action wishlist-remove cart-remove"
                          onClick={() => handleRemove(product._id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({itemCount})</span>
                <strong>{itemCount} units</strong>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Estimated Total</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <button
                type="button"
                className="button button-accent cart-checkout-button"
                disabled={cartItems.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <span aria-hidden="true">→</span>
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default Cart
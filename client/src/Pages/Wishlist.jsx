import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWishlist, notifyWishlistUpdated, removeWishlistProduct } from '../axiosCalls/WishlistApi.js'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function Wishlist() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [removingId, setRemovingId] = useState('')
  const { addToCart } = useCart()
  const [addingId, setAddingId] = useState('')

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchWishlist()
      setProducts(response.wishlist || [])
    } catch {
      setError('We couldn’t load your wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    setActionError('')
    try {
      await removeWishlistProduct(productId)
      setProducts((current) => current.filter((p) => p._id !== productId))
      notifyWishlistUpdated()
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to remove product from wishlist.')
    } finally {
      setRemovingId('')
    }
  }

  const handleMoveToCart = async (product) => {
    setAddingId(product._id)
    setActionError('')
    try {
      await addToCart(product._id)
      await handleRemove(product._id)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to move product to cart.')
    } finally {
      setAddingId('')
    }
  }

  return (
    <div className="vynk-page-wrapper">
      <Navbar />

      <main className="vynk-main-container">
        <header className="vynk-catalog-header">
          <div>
            <div className="vynk-greeting-badge">Saved Items</div>
            <h1 className="vynk-page-title">
              Your <span>Wishlist.</span>
            </h1>
            <p className="vynk-page-desc">
              {products.length} {products.length === 1 ? 'item' : 'items'} saved for later purchase.
            </p>
          </div>
        </header>

        {actionError && <div className="vynk-alert-error" style={{ marginBottom: '20px' }}>{actionError}</div>}

        {loading && (
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading your saved wishlist...</p>
          </div>
        )}

        {!loading && error && (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">⚠️</span>
            <h3>Unable to load wishlist</h3>
            <p>{error}</p>
            <button type="button" className="vynk-btn-secondary" onClick={loadWishlist}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">♥</span>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love while browsing to keep them organized in one place.</p>
            <Link to="/products" className="vynk-btn-primary">
              Explore Products →
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="vynk-products-grid">
            {products.map((product) => (
              <article className="vynk-product-card" key={product._id}>
                <div className="vynk-card-image-wrapper">
                  <Link to={`/products/${product._id}`} className="vynk-card-image-link">
                    <img src={product.image} alt={product.name} className="vynk-card-image" />
                  </Link>
                  <button
                    type="button"
                    className="vynk-wishlist-toggle active"
                    onClick={() => handleRemove(product._id)}
                    disabled={removingId === product._id}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>

                <div className="vynk-card-body">
                  <div className="vynk-card-category">{product.category}</div>
                  <Link to={`/products/${product._id}`} className="vynk-card-title-link">
                    <h3 className="vynk-card-title">{product.name}</h3>
                  </Link>
                  <div className="vynk-card-footer">
                    <span className="vynk-card-price">{formatPrice(product.price)}</span>
                    <button
                      type="button"
                      className="vynk-btn-primary vynk-btn-sm"
                      disabled={addingId === product._id || product.stock <= 0}
                      onClick={() => handleMoveToCart(product)}
                    >
                      {addingId === product._id ? 'Moving...' : 'Move to Cart'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Wishlist
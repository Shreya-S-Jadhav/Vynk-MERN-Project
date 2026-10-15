import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addWishlistProduct, notifyWishlistUpdated, removeWishlistProduct } from '../axiosCalls/WishlistApi.js'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function ProductCard({ product, isWishlisted = false, onWishlistChange }) {
  const [saved, setSaved] = useState(isWishlisted)
  const [saving, setSaving] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [feedback, setFeedback] = useState('')
  const { addToCart, cartItems } = useCart()

  const cartItem = cartItems.find((item) => (item.product?._id || item.product) === product._id)
  const cartQuantity = cartItem?.quantity || 0

  useEffect(() => { setSaved(isWishlisted) }, [isWishlisted])

  const handleWishlistClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (saving) return

    setSaving(true)
    setFeedback('')

    try {
      if (saved) {
        await removeWishlistProduct(product._id)
        setSaved(false)
        onWishlistChange?.(product._id, false)
      } else {
        await addWishlistProduct(product._id)
        setSaved(true)
        onWishlistChange?.(product._id, true)
      }
      notifyWishlistUpdated()
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Wishlist update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (addingToCart || product.stock <= 0) return
    if (cartQuantity >= product.stock) {
      setFeedback(`Max stock (${product.stock}) reached`)
      return
    }

    setAddingToCart(true)
    setFeedback('')
    try {
      await addToCart(product._id)
      setFeedback('Added to cart')
      setTimeout(() => setFeedback(''), 2500)
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Unable to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <article className="vynk-product-card">
      <div className="vynk-card-image-wrapper">
        <Link to={`/products/${product._id}`} className="vynk-card-image-link">
          <img src={product.image} alt={product.name} className="vynk-card-image" loading="lazy" />
        </Link>
        <button
          type="button"
          className={`vynk-wishlist-toggle ${saved ? 'active' : ''}`}
          onClick={handleWishlistClick}
          disabled={saving}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="vynk-card-badge-stock">Only {product.stock} left</span>
        )}
      </div>

      <div className="vynk-card-body">
        <div className="vynk-card-category">{product.category}</div>
        <Link to={`/products/${product._id}`} className="vynk-card-title-link">
          <h3 className="vynk-card-title">{product.name}</h3>
        </Link>
        <p className="vynk-card-desc">{product.description}</p>

        <div className="vynk-card-footer">
          <div className="vynk-card-price-col">
            <span className="vynk-card-price">{formatPrice(product.price)}</span>
            <span className="vynk-card-stock-indicator">
              {product.stock > 0 ? '● In Stock' : '○ Out of stock'}
            </span>
          </div>

          <button
            type="button"
            className="vynk-btn-cart"
            disabled={product.stock <= 0 || addingToCart || cartQuantity >= product.stock}
            onClick={handleAddToCart}
          >
            {addingToCart ? (
              'Adding...'
            ) : cartQuantity > 0 ? (
              `Added (${cartQuantity})`
            ) : (
              '+ Add to Cart'
            )}
          </button>
        </div>

        {feedback && <div className="vynk-card-alert">{feedback}</div>}
      </div>
    </article>
  )
}

export default ProductCard
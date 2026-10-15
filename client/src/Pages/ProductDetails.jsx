import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../axiosCalls/productApi.js'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const { addToCart, cartItems } = useCart()

  useEffect(() => {
    let mounted = true
    const loadProduct = async () => {
      try {
        setLoading(true)
        const result = await fetchProduct(id)
        if (mounted) setProduct(result)
      } catch (requestError) {
        if (mounted) setError(requestError.response?.status === 404 ? 'Product not found.' : 'Unable to load product.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProduct()
    return () => { mounted = false }
  }, [id])

  const cartQuantity = cartItems.find((item) => (item.product?._id || item.product) === product?._id)?.quantity || 0

  const handleAddToCart = async () => {
    if (!product || adding) return
    if (cartQuantity >= product.stock) {
      setActionError(`Cannot add more. Stock limit of ${product.stock} units reached.`)
      return
    }

    setActionError('')
    setActionSuccess('')
    setAdding(true)
    try {
      await addToCart(product._id)
      setActionSuccess('Added to your shopping cart!')
      setTimeout(() => setActionSuccess(''), 3000)
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to add product to cart.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading product details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">🔍</span>
            <h3>Product Not Found</h3>
            <p>{error || 'This product might have been moved or is no longer listed.'}</p>
            <Link to="/products" className="vynk-btn-primary">
              Return to Products →
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
        <div className="vynk-breadcrumb">
          <Link to="/products" className="vynk-back-link">
            ← Back to collection
          </Link>
          <span className="vynk-breadcrumb-sep">/</span>
          <span>{product.category}</span>
          <span className="vynk-breadcrumb-sep">/</span>
          <span className="vynk-breadcrumb-current">{product.name}</span>
        </div>

        <section className="vynk-product-detail-layout">
          <div className="vynk-detail-gallery">
            <div className="vynk-detail-image-box">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="vynk-detail-info">
            <div className="vynk-detail-category-badge">{product.category}</div>
            <h1 className="vynk-detail-title">{product.name}</h1>
            <div className="vynk-detail-price-row">
              <span className="vynk-detail-price">{formatPrice(product.price)}</span>
              <span className={`vynk-stock-chip ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
              </span>
            </div>

            <p className="vynk-detail-desc">{product.description}</p>

            <div className="vynk-detail-guarantees">
              <div>✓ Free express shipping across India</div>
              <div>✓ 7-day replacement guarantee</div>
              <div>✓ Verified authentic gear</div>
            </div>

            <div className="vynk-detail-action-box">
              <button
                type="button"
                className="vynk-btn-primary vynk-btn-lg vynk-btn-block"
                disabled={product.stock === 0 || adding}
                onClick={handleAddToCart}
              >
                {adding ? (
                  'Adding to Cart...'
                ) : cartQuantity > 0 ? (
                  `Add Another (${cartQuantity} in Cart)`
                ) : (
                  'Add to Shopping Cart'
                )}
              </button>

              <Link to="/cart" className="vynk-btn-secondary vynk-btn-lg vynk-btn-block">
                View Cart & Checkout →
              </Link>
            </div>

            {actionSuccess && <div className="vynk-alert-success">{actionSuccess}</div>}
            {actionError && <div className="vynk-alert-error">{actionError}</div>}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProductDetails
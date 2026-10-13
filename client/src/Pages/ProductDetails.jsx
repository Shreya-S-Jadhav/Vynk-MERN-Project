
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../services/productApi.js'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadProduct = async () => {
      try {
        setLoading(true)
        const result = await fetchProduct(id)
        if (mounted) setProduct(result)
      } catch (requestError) {
        if (mounted) setError(requestError.response?.status === 404 ? 'Product not found.' : 'Something went wrong while loading this product.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProduct()
    return () => { mounted = false }
  }, [id])

  if (loading) return <main className="catalog-page route-state">Loading product...</main>
  if (error) return <main className="catalog-page catalog-state catalog-error">{error}<Link className="text-link" to="/products">Back to products</Link></main>

  return (
    <main className="catalog-page shop-home">
      <nav className="site-nav home-nav" aria-label="Product navigation"><Link className="brand" to="/home"><span className="brand-mark">N</span><span>Nexora</span></Link><Link className="nav-link" to="/products">Back to products</Link></nav>
      <section className="product-detail-content">
        <Link className="text-link" to="/products">← All products</Link>
        <div className="product-detail-layout">
          <div className="product-detail-image"><img src={product.image} alt={product.name} /></div>
          <div className="product-detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-detail-price">{formatPrice(product.price)}</p><p className="product-detail-description">{product.description}</p><p className="product-stock">{product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}</p><button className="button button-accent" type="button" disabled={product.stock === 0} onClick={() => setAdded(true)}>{added ? 'Added to cart' : 'Add to cart'} <span aria-hidden="true">→</span></button></div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails
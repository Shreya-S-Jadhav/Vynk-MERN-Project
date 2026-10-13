import { Link } from 'react-router-dom'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function ProductCard({ product }) {
  return (
    <article className="catalog-product-card">
      <Link to={`/products/${product._id}`} className="catalog-product-image-wrap">
        <img src={product.image} alt={product.name} className="catalog-product-image" />
      </Link>
      <div className="catalog-product-meta">
        <p className="catalog-product-category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="catalog-product-description">{product.description}</p>
        <div className="catalog-product-footer"><strong>{formatPrice(product.price)}</strong><span>{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</span></div>
        <Link className="button button-dark catalog-details-button" to={`/products/${product._id}`}>View details <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  )
}

export default ProductCard
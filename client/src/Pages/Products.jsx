import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts } from '../services/productApi.js'

const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home', 'Beauty', 'Grocery']

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [sort, setSort] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetchProducts({ search, category, sort })
        if (mounted) setProducts(response.products || [])
      } catch {
        if (mounted) setError('Something went wrong while loading products.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProducts()
    return () => { mounted = false }
  }, [search, category, sort])

  return (
    <main className="catalog-page shop-home">
      <nav className="site-nav home-nav" aria-label="Catalog navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home"><span className="brand-mark">N</span><span>Nexora</span></Link>
        <div className="nav-actions"><Link className="nav-link" to="/profile">Account</Link><Link className="cart-link" to="/home">▱ Cart</Link></div>
      </nav>

      <section className="catalog-content">
        <div className="home-heading"><p className="eyebrow">THE NEXORA CATALOGUE</p><h1>Find your next <span>favourite.</span></h1><p>Browse real products from the catalogue, then open any item for the full story.</p></div>
        <div className="catalog-controls">
          <label className="catalog-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products by name..." aria-label="Search products" /></label>
          <label className="catalog-select">Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="catalog-select">Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="">Featured</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label>
        </div>

        {loading && <div className="catalog-state">Loading products...</div>}
        {!loading && error && <div className="catalog-state catalog-error">{error}</div>}
        {!loading && !error && products.length === 0 && <div className="catalog-state">No products found.</div>}
        {!loading && !error && products.length > 0 && <div className="catalog-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>
    </main>
  )
}

export default Products
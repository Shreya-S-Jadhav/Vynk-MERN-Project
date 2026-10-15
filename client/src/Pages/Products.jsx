import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Navbar from '../components/Navbar.jsx'
import { fetchProducts } from '../axiosCalls/productApi.js'
import { fetchWishlist } from '../axiosCalls/WishlistApi.js'

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [sort, setSort] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wishlistIds, setWishlistIds] = useState(() => new Set())

  useEffect(() => {
    let active = true
    fetchWishlist().then(({ wishlist = [] }) => {
      if (active) setWishlistIds(new Set(wishlist.map((p) => p._id)))
    }).catch(() => {})
    return () => { active = false }
  }, [])

  const handleWishlistChange = (productId, saved) => {
    setWishlistIds((current) => {
      const next = new Set(current)
      if (saved) next.add(productId)
      else next.delete(productId)
      return next
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetchProducts({ search: debouncedSearch, category, sort })
      setProducts(res.products || [])
    } catch {
      setError('Something went wrong while loading products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [debouncedSearch, category, sort])

  const resetFilters = () => {
    setSearch('')
    setCategory('All Categories')
    setSort('')
  }

  return (
    <div className="vynk-page-wrapper">
      <Navbar />

      <main className="vynk-main-container">
        <header className="vynk-catalog-header">
          <div>
            <div className="vynk-greeting-badge">The Vynk Collection</div>
            <h1 className="vynk-page-title">
              Designed for <span>everyday excellence.</span>
            </h1>
            <p className="vynk-page-desc">
              Browse our high-grade hardware, minimalist desk setups, and premium lifestyle audio.
            </p>
          </div>
        </header>

        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          onReset={resetFilters}
        />

        {loading && (
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading curated catalogue...</p>
          </div>
        )}

        {!loading && error && (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">⚠️</span>
            <h3>Unable to fetch products</h3>
            <p>{error}</p>
            <button type="button" className="vynk-btn-secondary" onClick={loadProducts}>
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="vynk-empty-card">
            <span className="vynk-empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try searching with different keywords or clearing your active filters.</p>
            <button type="button" className="vynk-btn-primary" onClick={resetFilters}>
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="vynk-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistIds.has(product._id)}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Products
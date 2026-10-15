import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Navbar from '../components/Navbar.jsx'
import KineticBackground from '../components/KineticBackground.jsx'
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
    <div className="vynk-page-wrapper vynk-kinetic-page">
      <KineticBackground />
      <Navbar />

      <main className="vynk-main-container vynk-relative-content">
        <header className="vynk-catalog-header">
          <div className="vynk-status-pill">
            <span className="vynk-pulse-dot" />
            <span>VYNK CATALOGUE // ARCHIVE INDEX</span>
          </div>
          <h1 className="vynk-hero-headline">
            Curated Artifacts.<br />
            <span className="vynk-glow-text">Everyday excellence.</span>
          </h1>
          <p className="vynk-hero-subtext">
            High-grade industrial electronics, acoustic systems, and precision workspace architecture.
          </p>
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
          <div className="vynk-empty-state">
            <div className="vynk-pulse-dot" style={{ margin: '0 auto 1.5rem', width: 14, height: 14 }} />
            <p className="vynk-empty-desc">Accessing indexed hardware...</p>
          </div>
        )}

        {!loading && error && (
          <div className="vynk-empty-state">
            <span className="vynk-empty-icon">⚠️</span>
            <h3 className="vynk-empty-title">Catalogue connection error</h3>
            <p className="vynk-empty-desc">{error}</p>
            <button type="button" className="vynk-btn-secondary" onClick={loadProducts}>
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="vynk-empty-state">
            <span className="vynk-empty-icon">🔍</span>
            <h3 className="vynk-empty-title">No artifacts found</h3>
            <p className="vynk-empty-desc">Try clearing filters or searching for alternative gear keywords.</p>
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
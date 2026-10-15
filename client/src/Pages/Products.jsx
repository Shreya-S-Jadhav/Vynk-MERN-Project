import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { fetchProducts } from '../axiosCalls/productApi.js'
import { fetchWishlist } from '../axiosCalls/WishlistApi.js'
import WishlistNavLink from '../components/WishlistNavLink.jsx'
import CartNavLink from '../components/CartNavLink.jsx'

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
      if (active) setWishlistIds(new Set(wishlist.map((product) => product._id)))
    }).catch(() => {})

    return () => { active = false }
  }, [])

  const handleWishlistChange = (productId, saved) => {
    setWishlistIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (saved) nextIds.add(productId)
      else nextIds.delete(productId)
      return nextIds
    })
  }
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(timer)
  }, [search])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchProducts({ search: debouncedSearch, category, sort })
      setProducts(response.products || [])
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
    <main className="catalog-page shop-home">
      <nav className="site-nav home-nav" aria-label="Catalog navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home"><span className="brand-mark">N</span><span>Nexora</span></Link>
        <div className="nav-actions"><Link className="nav-link" to="/products">Products</Link><WishlistNavLink /><CartNavLink /><Link className="nav-link" to="/profile">Account</Link></div>
      </nav>

      <section className="catalog-content">
        <div className="home-heading"><p className="eyebrow">THE NEXORA CATALOGUE</p><h1>Find your next <span>favourite.</span></h1><p>Browse real products from the catalogue, then open any item for the full story.</p></div>
        <SearchBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort} onReset={resetFilters} />

        {loading && <div className="catalog-state">Loading products...</div>}
        {!loading && error && <div className="catalog-state catalog-error"><span>{error}</span><button type="button" className="catalog-retry" onClick={loadProducts}>Retry request</button></div>}
        {!loading && !error && products.length === 0 && <div className="catalog-state"><span>No products found.</span><button type="button" className="catalog-reset" onClick={resetFilters}>Clear all filters</button></div>}
        {!loading && !error && products.length > 0 && <div className="catalog-grid">{products.map((product) => <ProductCard key={product._id} product={product} isWishlisted={wishlistIds.has(product._id)} onWishlistChange={handleWishlistChange} />)}</div>}
      </section>
    </main>
  )
}

export default Products
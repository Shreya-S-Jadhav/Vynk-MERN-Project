import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { fetchProducts } from '../axiosCalls/productApi.js'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import KineticBackground from '../components/KineticBackground.jsx'

function Home() {
  const { user } = useAuth()
  const { cartCount, subtotal } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const firstName = user?.fullName?.split(' ')[0] || 'Member'

  useEffect(() => {
    let isMounted = true
    const loadFeatured = async () => {
      try {
        const data = await fetchProducts()
        const list = Array.isArray(data) ? data : data.products || []
        if (isMounted) {
          setFeaturedProducts(list.slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to load featured products:', err)
      } finally {
        if (isMounted) setLoadingProducts(false)
      }
    }
    loadFeatured()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="vynk-page-wrapper vynk-kinetic-page">
      {/* Dynamic Animated Canvas Background */}
      <KineticBackground />

      <Navbar />

      {/* Kinetic Marquee Ticker */}
      <div className="vynk-marquee-strip" aria-hidden="true">
        <div className="vynk-marquee-track">
          <span>⚡ VYNK ARCHIVE 2026</span>
          <span className="vynk-marquee-dot">•</span>
          <span>CURATED INDUSTRIAL HARDWARE</span>
          <span className="vynk-marquee-dot">•</span>
          <span>HIGH-FIDELITY ACOUSTICS</span>
          <span className="vynk-marquee-dot">•</span>
          <span>BESPOKE MINIMAL DESKTOP</span>
          <span className="vynk-marquee-dot">•</span>
          <span>LIMITED BATCH ALLOCATIONS</span>
          <span className="vynk-marquee-dot">•</span>
          <span>⚡ VYNK ARCHIVE 2026</span>
          <span className="vynk-marquee-dot">•</span>
          <span>CURATED INDUSTRIAL HARDWARE</span>
          <span className="vynk-marquee-dot">•</span>
          <span>HIGH-FIDELITY ACOUSTICS</span>
          <span className="vynk-marquee-dot">•</span>
          <span>BESPOKE MINIMAL DESKTOP</span>
        </div>
      </div>

      <main className="vynk-main-container vynk-relative-content">
        {/* Editorial Hero Section */}
        <section className="vynk-home-hero">
          <div className="vynk-status-pill">
            <span className="vynk-pulse-dot" />
            <span>TERMINAL ACTIVE // ARCHIVE ACCESS GRANTED</span>
          </div>

          <h1 className="vynk-hero-headline">
            Welcome back, <br />
            <span className="vynk-glow-text">{firstName}.</span>
          </h1>

          <p className="vynk-hero-subtext">
            Your personal hub for curated industrial design, acoustic precision, and workspace architecture. Ready for immediate dispatch.
          </p>

          {/* Quick Metrics Bar */}
          <div className="vynk-metrics-dock">
            <Link to="/cart" className="vynk-metric-chip">
              <span className="vynk-metric-label">BAG ALLOCATION</span>
              <span className="vynk-metric-val">{cartCount} items</span>
              <span className="vynk-metric-meta">₹{subtotal.toLocaleString('en-IN')}</span>
            </Link>

            <Link to="/wishlist" className="vynk-metric-chip">
              <span className="vynk-metric-label">SAVED VAULT</span>
              <span className="vynk-metric-val">Wishlist</span>
              <span className="vynk-metric-meta">View Saved →</span>
            </Link>

            <Link to="/orders" className="vynk-metric-chip">
              <span className="vynk-metric-label">LOGISTICS</span>
              <span className="vynk-metric-val">Dispatches</span>
              <span className="vynk-metric-meta">Track History →</span>
            </Link>

          </div>
        </section>

        {/* Dynamic Navigation Tiles */}
        <section className="vynk-dash-tiles-section">
          <div className="vynk-section-header-compact">
            <span className="vynk-section-tag">01 // NAVIGATE</span>
            <h2 className="vynk-section-title-sm">Command Deck</h2>
          </div>

          <div className="vynk-dash-tiles-grid">
            <Link to="/products" className="vynk-dash-tile vynk-tile-spotlight">
              <div className="vynk-tile-glow" />
              <div className="vynk-tile-badge">CATALOGUE</div>
              <div className="vynk-tile-content">
                <span className="vynk-tile-num">01</span>
                <h3>The Collection</h3>
                <p>Explore industrial electronics, acoustic systems, and precision desk gear.</p>
              </div>
              <span className="vynk-tile-action">Browse All Drops ↗</span>
            </Link>

            <Link to="/cart" className="vynk-dash-tile">
              <div className="vynk-tile-badge">BAG & CHECKOUT</div>
              <div className="vynk-tile-content">
                <span className="vynk-tile-num">02</span>
                <h3>Shopping Bag</h3>
                <p>Instant checkout with Razorpay or Cash on Delivery options.</p>
              </div>
              <span className="vynk-tile-action">Review Bag ({cartCount}) ↗</span>
            </Link>

            <Link to="/wishlist" className="vynk-dash-tile">
              <div className="vynk-tile-badge">VAULT</div>
              <div className="vynk-tile-content">
                <span className="vynk-tile-num">03</span>
                <h3>Wishlist</h3>
                <p>Bookmarked artifacts kept on hold for your next requisition.</p>
              </div>
              <span className="vynk-tile-action">Open Vault ↗</span>
            </Link>

            <Link to="/orders" className="vynk-dash-tile">
              <div className="vynk-tile-badge">FULFILLMENT</div>
              <div className="vynk-tile-content">
                <span className="vynk-tile-num">04</span>
                <h3>Order Log</h3>
                <p>Verify dispatch status, view invoices, and confirm transit details.</p>
              </div>
              <span className="vynk-tile-action">Order History ↗</span>
            </Link>
          </div>
        </section>

        {/* Featured Drop Spotlight Section */}
        {featuredProducts.length > 0 && (
          <section className="vynk-drop-spotlight-section">
            <div className="vynk-section-header">
              <div>
                <span className="vynk-section-tag">02 // CURATED ARTIFACTS</span>
                <h2 className="vynk-section-title">Latest Arrivals</h2>
              </div>
              <Link to="/products" className="vynk-link-action">
                View Full Index ({featuredProducts.length}+ pieces) →
              </Link>
            </div>

            <div className="vynk-products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Home
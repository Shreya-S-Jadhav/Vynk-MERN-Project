import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

function Landing() {
  return (
    <div className="vynk-page-wrapper">
      <Navbar publicNav={true} />

      <main className="vynk-landing-hero">
        <div className="vynk-hero-badge">Next Generation E-Commerce</div>
        <h1 className="vynk-hero-title">
          Modern essentials,<br />
          <span>delivered to your door.</span>
        </h1>
        <p className="vynk-hero-subtitle">
          Experience seamless shopping with curated products, instant cart synchronization, and secure Razorpay checkout.
        </p>

        <div className="vynk-hero-actions">
          <Link to="/products" className="vynk-btn-primary vynk-btn-lg">
            Explore Collection →
          </Link>
          <Link to="/login" className="vynk-btn-secondary vynk-btn-lg">
            Sign In to Account
          </Link>
        </div>

        <div className="vynk-features-grid">
          <div className="vynk-feature-card">
            <span className="vynk-feature-icon">⚡</span>
            <h3>Instant Sync</h3>
            <p>Real-time cart and wishlist synchronization across your devices.</p>
          </div>
          <div className="vynk-feature-card">
            <span className="vynk-feature-icon">🛡️</span>
            <h3>Secure Checkout</h3>
            <p>End-to-end encrypted test payments powered by Razorpay.</p>
          </div>
          <div className="vynk-feature-card">
            <span className="vynk-feature-icon">📦</span>
            <h3>Order Tracking</h3>
            <p>Live status updates from placement through confirmation and delivery.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
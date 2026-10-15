import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import KineticBackground from '../components/KineticBackground.jsx'

function Landing() {
  return (
    <div className="vynk-page-wrapper vynk-kinetic-page">
      <KineticBackground />
      <Navbar publicNav={true} />

      {/* Kinetic Marquee Ticker */}
      <div className="vynk-marquee-strip" aria-hidden="true">
        <div className="vynk-marquee-track">
          <span>⚡ VYNK STUDIO</span>
          <span className="vynk-marquee-dot">•</span>
          <span>CURATED INDUSTRIAL HARDWARE</span>
          <span className="vynk-marquee-dot">•</span>
          <span>LIMITED BATCHES</span>
          <span className="vynk-marquee-dot">•</span>
          <span>GLOBAL DISPATCH</span>
          <span className="vynk-marquee-dot">•</span>
          <span>HIGH-FIDELITY AUDIO & LIVING</span>
          <span className="vynk-marquee-dot">•</span>
          <span>⚡ VYNK STUDIO</span>
          <span className="vynk-marquee-dot">•</span>
          <span>CURATED INDUSTRIAL HARDWARE</span>
        </div>
      </div>

      <main className="vynk-landing-hero vynk-relative-content">
        <div className="vynk-status-pill">
          <span className="vynk-pulse-dot" />
          <span>VYNK EDITION 2026 // OPEN CATALOGUE</span>
        </div>

        <h1 className="vynk-hero-headline">
          Industrial precision.<br />
          <span className="vynk-glow-text">Sensory living.</span>
        </h1>

        <p className="vynk-hero-subtext">
          A meticulously curated archive of acoustic instruments, desk architecture, and industrial design objects crafted for modern creators.
        </p>

        <div className="vynk-hero-actions">
          <Link to="/products" className="vynk-btn-primary vynk-btn-glow vynk-btn-lg">
            Explore Archive Drop →
          </Link>
          <Link to="/login" className="vynk-btn-glass vynk-btn-lg">
            Member Sign In
          </Link>
        </div>

        <div className="vynk-features-grid">
          <div className="vynk-feature-card">
            <div className="vynk-feature-header">
              <span className="vynk-feature-code">01 //</span>
              <span className="vynk-feature-icon">⚡</span>
            </div>
            <h3>Instant Synchronization</h3>
            <p>Persistent cloud cart & wishlist vault synced across all your sessions.</p>
          </div>

          <div className="vynk-feature-card">
            <div className="vynk-feature-header">
              <span className="vynk-feature-code">02 //</span>
              <span className="vynk-feature-icon">🛡️</span>
            </div>
            <h3>Encrypted Checkout</h3>
            <p>Seamless checkout backed by Razorpay payments and Cash on Delivery flexibility.</p>
          </div>

          <div className="vynk-feature-card">
            <div className="vynk-feature-header">
              <span className="vynk-feature-code">03 //</span>
              <span className="vynk-feature-icon">📦</span>
            </div>
            <h3>Direct Logistics</h3>
            <p>End-to-end order snapshots with immutable tracking IDs and real-time status.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
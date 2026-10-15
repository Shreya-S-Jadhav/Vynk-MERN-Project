import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

function Home() {
  const { user } = useAuth()
  const firstName = user?.fullName?.split(' ')[0] || 'Member'

  return (
    <div className="vynk-page-wrapper">
      <Navbar />

      <main className="vynk-main-container">
        <section className="vynk-dashboard-hero">
          <div className="vynk-greeting-badge">Member Dashboard</div>
          <h1 className="vynk-page-title">
            Welcome back, <span>{firstName}.</span>
          </h1>
          <p className="vynk-page-desc">
            Discover curated essentials, track your orders, or manage your personal shopping space.
          </p>
        </section>

        <div className="vynk-dashboard-grid">
          <article className="vynk-dash-card vynk-dash-featured">
            <div className="vynk-dash-card-header">
              <span className="vynk-dash-pill">Catalogue</span>
              <span className="vynk-dash-icon">🛍️</span>
            </div>
            <h2>Curated Products</h2>
            <p>Explore our latest gear, desktop accessories, audio, and furniture collection.</p>
            <Link to="/products" className="vynk-btn-primary vynk-btn-md">
              Browse Products →
            </Link>
          </article>

          <article className="vynk-dash-card">
            <div className="vynk-dash-card-header">
              <span className="vynk-dash-pill">History</span>
              <span className="vynk-dash-icon">📦</span>
            </div>
            <h2>Your Orders</h2>
            <p>Review purchase history, order delivery statuses, and invoices.</p>
            <Link to="/orders" className="vynk-btn-secondary vynk-btn-md">
              View Orders →
            </Link>
          </article>

          <article className="vynk-dash-card">
            <div className="vynk-dash-card-header">
              <span className="vynk-dash-pill">Saved</span>
              <span className="vynk-dash-icon">♥</span>
            </div>
            <h2>Your Wishlist</h2>
            <p>Saved favorites ready to move into your bag whenever you're ready.</p>
            <Link to="/wishlist" className="vynk-btn-secondary vynk-btn-md">
              Open Wishlist →
            </Link>
          </article>

          <article className="vynk-dash-card">
            <div className="vynk-dash-card-header">
              <span className="vynk-dash-pill">Profile</span>
              <span className="vynk-dash-icon">👤</span>
            </div>
            <h2>Account Details</h2>
            <p>Logged in as <strong>{user?.email}</strong>. Manage your shipping addresses.</p>
            <Link to="/profile" className="vynk-btn-secondary vynk-btn-md">
              Edit Profile →
            </Link>
          </article>
        </div>
      </main>
    </div>
  )
}

export default Home
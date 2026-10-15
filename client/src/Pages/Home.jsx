import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import WishlistNavLink from '../components/WishlistNavLink.jsx'
import CartNavLink from '../components/CartNavLink.jsx'


function Home() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="home-page shop-home">
      <nav className="site-nav home-nav" aria-label="Account navigation">
        <Link className="brand" to="/home" aria-label="Nexora dashboard">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </Link>
        <div className="market-search" role="search"><span aria-hidden="true">⌕</span><span>Search products, brands and more</span></div>
        <div className="nav-actions"><Link className="nav-link" to="/products">Products</Link><WishlistNavLink /><CartNavLink /><Link className="nav-link" to="/profile">Account</Link><Link className="nav-link" to="/home">Orders</Link><button className="nav-link logout-button" type="button" onClick={handleLogout}>Log out</button></div>
      </nav>

      <section className="home-content">
        <div className="home-heading">
          <p className="eyebrow">YOUR SHOPPING SPACE</p>
          <h1>Welcome back, <span>{user?.fullName?.split(' ')[0] || 'shopper'}.</span></h1>
          <p>Pick up where you left off or find something new for your home.</p>
        </div>

         <div className="shop-discovery-banner"><div><p className="eyebrow">REAL PRODUCTS, READY TO DISCOVER</p><h2>Browse the full catalogue.</h2><p>Search, filter, and find the right thing for your everyday.</p></div><Link className="button button-accent" to="/products">Explore products <span aria-hidden="true">→</span></Link></div>

        <div className="account-grid shop-account-grid">
          <article className="account-card account-card-primary">
            <div className="card-label"><span className="card-number">01</span> ACCOUNT</div>
            <Link className="profile-row" to="/profile"><span className="profile-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'N'}</span><div><h2>{user?.fullName || 'Nexora customer'}</h2><p>{user?.email || 'No email available'}</p></div></Link>
            <div className="card-detail"><span>Phone</span><strong>{user?.phone || 'Not provided'}</strong></div>
          </article>
          <article className="account-card account-card-secondary">
            <div className="card-label"><span className="card-number">02</span> ORDER SUPPORT</div>
            <div className="status-icon" aria-hidden="true">↗</div>
            <h2>Need help with an order?</h2>
            <p>Our support team is ready to help with delivery, returns, or anything else.</p>
            <Link className="text-link" to="/home">View your orders <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Home
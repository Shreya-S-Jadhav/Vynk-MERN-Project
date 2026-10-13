import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'


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
        <div className="nav-actions"><Link className="nav-link" to="/profile">Account</Link><Link className="nav-link" to="/home">Orders</Link><span className="cart-link">▱ Cart</span><button className="nav-link logout-button" type="button" onClick={handleLogout}>Log out</button></div>
      </nav>

      <section className="home-content">
        <div className="home-heading">
          <p className="eyebrow">YOUR SHOPPING SPACE</p>
          <h1>Welcome back, <span>{user?.fullName?.split(' ')[0] || 'shopper'}.</span></h1>
          <p>Pick up where you left off or find something new for your home.</p>
        </div>

        <div className="shop-toolbar"><strong>Recommended for you</strong><button type="button">Sort by: Featured <span aria-hidden="true">⌄</span></button></div>
        <div className="product-grid">
          <article className="product-card"><div className="product-art product-art-sage"><span>HOME</span><strong>01</strong></div><div className="product-meta"><p>Everyday ceramic set</p><strong>$32.00</strong><span>★★★★★ <small>(24)</small></span></div></article>
          <article className="product-card"><div className="product-art product-art-peach"><span>TECH</span><strong>02</strong></div><div className="product-meta"><p>Desk speaker, warm sound</p><strong>$58.00</strong><span>★★★★★ <small>(18)</small></span></div></article>
          <article className="product-card"><div className="product-art product-art-yellow"><span>STYLE</span><strong>03</strong></div><div className="product-meta"><p>Canvas daily carry</p><strong>$46.00</strong><span>★★★★☆ <small>(31)</small></span></div></article>
          <article className="product-card"><div className="product-art product-art-blue"><span>HOME</span><strong>04</strong></div><div className="product-meta"><p>Soft linen throw</p><strong>$39.00</strong><span>★★★★★ <small>(12)</small></span></div></article>
        </div>

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
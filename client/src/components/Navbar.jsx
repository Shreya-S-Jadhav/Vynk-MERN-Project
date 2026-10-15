import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import WishlistNavLink from './WishlistNavLink.jsx'

function Navbar({ publicNav = false }) {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="vynk-navbar-header">
      <div className="vynk-navbar-container">
        <Link to={user ? "/home" : "/"} className="vynk-brand" aria-label="Vynk Home">
          <div className="vynk-brand-badge">V</div>
          <span className="vynk-brand-name">Vynk</span>
        </Link>

        {publicNav && !user ? (
          <nav className="vynk-nav-actions">
            <Link to="/products" className={`vynk-nav-link ${isActive('/products') ? 'active' : ''}`}>
              Explore
            </Link>
            <Link to="/login" className="vynk-nav-link">
              Log in
            </Link>
            <Link to="/signup" className="vynk-btn-primary vynk-btn-sm">
              Sign up
            </Link>
          </nav>
        ) : (
          <nav className="vynk-nav-actions">
            <Link to="/products" className={`vynk-nav-link ${isActive('/products') ? 'active' : ''}`}>
              Products
            </Link>
            <WishlistNavLink />
            <Link to="/cart" className={`vynk-nav-link vynk-cart-badge-link ${isActive('/cart') ? 'active' : ''}`}>
              <span>Cart</span>
              {cartCount > 0 && <span className="vynk-counter-pill">{cartCount}</span>}
            </Link>
            <Link to="/orders" className={`vynk-nav-link ${isActive('/orders') ? 'active' : ''}`}>
              Orders
            </Link>
            <Link to="/profile" className={`vynk-nav-link vynk-account-link ${isActive('/profile') ? 'active' : ''}`}>
              <span className="vynk-avatar-mini">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <span className="vynk-account-text">{user?.fullName?.split(' ')[0] || 'Account'}</span>
            </Link>
            <button type="button" onClick={handleLogout} className="vynk-nav-logout-btn" title="Log out">
              Exit
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar

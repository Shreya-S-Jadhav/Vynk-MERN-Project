import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function CartNavLink() {
  const { cartCount } = useCart()
  const location = useLocation()
  const isActive = location.pathname === '/cart'

  return (
    <Link to="/cart" className={`vynk-nav-link vynk-cart-badge-link ${isActive ? 'active' : ''}`}>
      <span>Cart</span>
      {cartCount > 0 && <span className="vynk-counter-pill">{cartCount}</span>}
    </Link>
  )
}

export default CartNavLink

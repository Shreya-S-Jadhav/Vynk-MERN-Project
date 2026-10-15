import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function CartNavLink() {
  const { cartCount } = useCart()

  return (
    <Link className="nav-link cart-nav-link" to="/cart">
      Cart ({cartCount})
    </Link>
  )
}

export default CartNavLink

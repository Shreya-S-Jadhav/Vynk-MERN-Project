import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addToCartApi, fetchCart, removeFromCartApi, updateCartQuantityApi } from '../axiosCalls/cartApi.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState('')

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([])
      setCartLoading(false)
      setCartError('')
      return
    }

    setCartLoading(true)
    setCartError('')
    try {
      const items = await fetchCart()
      setCartItems(Array.isArray(items) ? items : [])
    } catch (err) {
      setCartError(err.response?.data?.message || 'Unable to load your cart.')
    } finally {
      setCartLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(async (productId) => {
    const updatedCart = await addToCartApi(productId)
    setCartItems(Array.isArray(updatedCart) ? updatedCart : [])
    return updatedCart
  }, [])

  const updateQuantity = useCallback(async (productId, quantity) => {
    const updatedCart = await updateCartQuantityApi(productId, quantity)
    setCartItems(Array.isArray(updatedCart) ? updatedCart : [])
    return updatedCart
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    const updatedCart = await removeFromCartApi(productId)
    setCartItems(Array.isArray(updatedCart) ? updatedCart : [])
    return updatedCart
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)
  }, [cartItems])

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product?.price || 0)
      const qty = Number(item.quantity || 0)
      return total + price * qty
    }, 0)
  }, [cartItems])

  const value = useMemo(() => ({
    cartItems,
    cartLoading,
    cartError,
    cartCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    clearCart,
  }), [cartItems, cartLoading, cartError, cartCount, subtotal, addToCart, updateQuantity, removeFromCart, refreshCart, clearCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

import { axiosInstance } from './axios.js'

export const fetchCart = async () => {
  const response = await axiosInstance.get('/cart')
  return response.data?.cart || []
}

export const addToCartApi = async (productId) => {
  const response = await axiosInstance.post(`/cart/${productId}`)
  return response.data?.cart || []
}

export const updateCartQuantityApi = async (productId, quantity) => {
  const response = await axiosInstance.patch(`/cart/${productId}`, { quantity })
  return response.data?.cart || []
}

export const removeFromCartApi = async (productId) => {
  const response = await axiosInstance.delete(`/cart/${productId}`)
  return response.data?.cart || []
}

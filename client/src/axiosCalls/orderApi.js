import { axiosInstance } from './axios.js'

export const createPaymentOrderApi = async (shippingAddress) => {
  const response = await axiosInstance.post('/orders/create-payment-order', {
    shippingAddress,
  })
  return response.data
}

export const verifyPaymentApi = async (paymentData) => {
  const response = await axiosInstance.post('/orders/verify-payment', paymentData)
  return response.data
}

export const fetchOrdersApi = async () => {
  const response = await axiosInstance.get('/orders')
  return response.data?.orders || []
}

export const fetchOrderByIdApi = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`)
  return response.data?.order
}

export const updateOrderStatusApi = async (id, status) => {
  const response = await axiosInstance.patch(`/orders/${id}/status`, { status })
  return response.data?.order
}

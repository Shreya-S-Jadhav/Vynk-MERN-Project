import Razorpay from 'razorpay'

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'

  return new Razorpay({
    key_id,
    key_secret,
  })
}

export default getRazorpayInstance

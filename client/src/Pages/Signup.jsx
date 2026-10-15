import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import StatusMessage from '../components/StatusMessage.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [loader, setLoader] = useState(false)
  const [err, setErr] = useState(location.state?.message || '')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoader(true)
    try {
      const response = await axiosInstance.post('/customer/register', form)
      setUser(response.data.customer)
      setLoader(false)
      navigate('/home', { replace: true })
    } catch (error) {
      setLoader(false)
      if (error.response?.status === 409) {
        navigate('/login', {
          state: { message: 'An account already exists with this email. Please log in.' },
        })
        return
      }
      setErr(error.response?.data?.message || 'Unable to register. Please check your information.')
    }
  }

  return (
    <div className="vynk-auth-page">
      <div className="vynk-auth-card">
        <div className="vynk-auth-header">
          <Link to="/" className="vynk-brand" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <div className="vynk-brand-badge">V</div>
            <span className="vynk-brand-name">Vynk</span>
          </Link>
          <h2>Create your account</h2>
          <p>Join Vynk for exclusive drops, instant cart, and tracking</p>
        </div>

        <form className="vynk-auth-form" onSubmit={handleSubmit}>
          <StatusMessage message={err} />

          <div className="vynk-form-field">
            <label className="vynk-field-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Alex Morgan"
              value={form.fullName}
              onChange={handleChange}
              className="vynk-field-input"
              required
            />
          </div>

          <div className="vynk-form-field">
            <label className="vynk-field-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              className="vynk-field-input"
              required
            />
          </div>

          <div className="vynk-form-field">
            <label className="vynk-field-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="vynk-field-input"
              required
            />
          </div>

          <div className="vynk-form-field">
            <label className="vynk-field-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              className="vynk-field-input"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loader}
            className="vynk-btn-primary vynk-btn-lg vynk-btn-block"
            style={{ marginTop: '12px' }}
          >
            {loader ? 'Creating Account...' : 'Sign Up to Vynk'}
          </button>
        </form>

        <footer className="vynk-auth-footer">
          Already have an account? <Link to="/login" className="vynk-link-accent">Sign in</Link>
        </footer>
      </div>
    </div>
  )
}

export default Signup
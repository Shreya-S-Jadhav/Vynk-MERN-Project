import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import StatusMessage from '../components/StatusMessage.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
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
      const response = await axiosInstance.post('/customer/login', form)
      setUser(response.data.customer)
      setLoader(false)
      navigate('/home', { replace: true })
    } catch (error) {
      setLoader(false)
      if (error.response?.status === 404) {
        navigate('/signup', {
          state: { message: 'Account not found. Please create an account.' },
        })
        return
      }
      setErr(error.response?.data?.message || 'Unable to log in. Please check your credentials.')
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
          <h2>Welcome back</h2>
          <p>Sign in to your Vynk account to continue</p>
        </div>

        <form className="vynk-auth-form" onSubmit={handleSubmit}>
          <StatusMessage message={err} />

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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="vynk-field-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loader}
            className="vynk-btn-primary vynk-btn-lg vynk-btn-block"
            style={{ marginTop: '12px' }}
          >
            {loader ? 'Signing in...' : 'Sign in to Vynk'}
          </button>
        </form>

        <footer className="vynk-auth-footer">
          Don't have an account? <Link to="/signup" className="vynk-link-accent">Create account</Link>
        </footer>
      </div>
    </div>
  )
}

export default Login
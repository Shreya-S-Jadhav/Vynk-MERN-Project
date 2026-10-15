import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import StatusMessage from '../components/StatusMessage.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const emptyAddress = { street: '', city: '', postalCode: '', country: '' }

function CustomerProfile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', ...emptyAddress })
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get('/customer/me')
        if (!mounted) return
        const customer = response.data.authenticatedCustomer
        setUser(customer)
        setForm({
          fullName: customer.fullName || '',
          email: customer.email || '',
          phone: customer.phone || '',
          ...emptyAddress,
          ...(customer.shippingAddress || {})
        })
      } catch (requestError) {
        if (mounted) setError(requestError.response?.data?.message || 'Unable to load your profile.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()
    return () => { mounted = false }
  }, [setUser])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage('')
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    setPreviewImage(URL.createObjectURL(file))
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await axiosInstance.put('/customer/profile', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        shippingAddress: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country
        }
      })
      let updatedCustomer = response.data.customer

      if (selectedImage) {
        setUploading(true)
        const imageData = new FormData()
        imageData.append('profileImage', selectedImage)
        const imageResponse = await axiosInstance.post('/customer/profile/image', imageData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        updatedCustomer = imageResponse.data.customer
      }

      setUser(updatedCustomer)
      setSelectedImage(null)
      setMessage('Profile settings saved successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="vynk-page-wrapper">
        <Navbar />
        <main className="vynk-main-container">
          <div className="vynk-loading-state">
            <div className="vynk-spinner" />
            <p>Loading account details...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="vynk-page-wrapper">
      <Navbar />

      <main className="vynk-main-container">
        <header className="vynk-catalog-header">
          <div>
            <div className="vynk-greeting-badge">Account Settings</div>
            <h1 className="vynk-page-title">
              Your <span>Profile.</span>
            </h1>
            <p className="vynk-page-desc">Manage personal contact details and saved delivery address.</p>
          </div>
        </header>

        <StatusMessage message={error} />
        {message && <div className="vynk-alert-success" style={{ marginBottom: '24px' }}>✓ {message}</div>}

        <form className="vynk-profile-grid" onSubmit={handleSubmit}>
          <aside className="vynk-profile-side-card">
            <div className="vynk-profile-avatar-box">
              {previewImage || user?.profileImage ? (
                <img src={previewImage || user.profileImage} alt="Profile" />
              ) : (
                user?.fullName?.charAt(0)?.toUpperCase() || 'V'
              )}
            </div>

            <label className="vynk-upload-label">
              <span>Change Photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
            {selectedImage && <p className="vynk-file-note">{selectedImage.name}</p>}

            <div className="vynk-user-email-tag">{user?.email}</div>
          </aside>

          <section className="vynk-profile-main-card">
            <h3 className="vynk-form-section-title">Personal Information</h3>
            <div className="vynk-form-row-duo">
              <div className="vynk-form-field">
                <label className="vynk-field-label">Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="vynk-field-input" required />
              </div>
              <div className="vynk-form-field">
                <label className="vynk-field-label">Phone Number</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="vynk-field-input" required />
              </div>
            </div>

            <div className="vynk-form-field">
              <label className="vynk-field-label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="vynk-field-input" required />
            </div>

            <h3 className="vynk-form-section-title" style={{ marginTop: '28px' }}>Default Shipping Address</h3>
            <div className="vynk-form-field">
              <label className="vynk-field-label">Street Address</label>
              <input name="street" value={form.street} onChange={handleChange} placeholder="House / Flat, Street name" className="vynk-field-input" />
            </div>

            <div className="vynk-form-row-tri">
              <div className="vynk-form-field">
                <label className="vynk-field-label">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="vynk-field-input" />
              </div>
              <div className="vynk-form-field">
                <label className="vynk-field-label">Postal Code</label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange} className="vynk-field-input" />
              </div>
              <div className="vynk-form-field">
                <label className="vynk-field-label">Country</label>
                <input name="country" value={form.country} onChange={handleChange} className="vynk-field-input" />
              </div>
            </div>

            <button type="submit" className="vynk-btn-primary vynk-btn-lg" style={{ marginTop: '24px' }} disabled={saving}>
              {saving ? (uploading ? 'Uploading Photo...' : 'Saving Changes...') : 'Save Changes'}
            </button>
          </section>
        </form>
      </main>
    </div>
  )
}

export default CustomerProfile
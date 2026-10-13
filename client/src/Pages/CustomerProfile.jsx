import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import StatusMessage from '../components/StatusMessage.jsx'
import { useAuth } from '../context/AuthContext.jsx'

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

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    setMessage('')
    setError('')
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    setPreviewImage(URL.createObjectURL(file))
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
      setMessage('Profile updated successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update your profile.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  if (loading) return <main className="profile-page route-state">Loading your profile...</main>

  return (
    <main className="profile-page shop-home">
      <nav className="site-nav home-nav" aria-label="Account navigation">
        <Link className="brand" to="/home" aria-label="Back to Nexora home"><span className="brand-mark">N</span><span>Nexora</span></Link>
        <Link className="nav-link" to="/home">Back to shopping</Link>
      </nav>

      <section className="profile-content">
        <div className="home-heading"><p className="eyebrow">ACCOUNT SETTINGS</p><h1>Your profile<span>.</span></h1><p>Keep your contact and delivery details ready for your next order.</p></div>
        <StatusMessage message={error} />
        {message && <div className="profile-success" role="status">✓ {message}</div>}

        <form className="profile-layout" onSubmit={handleSubmit}>
          <section className="profile-card profile-identity">
            <div className="card-label"><span className="card-number">01</span> CUSTOMER PROFILE</div>
            <div className="profile-avatar-large">{previewImage || user?.profileImage ? <img src={previewImage || user.profileImage} alt="Profile" /> : user?.fullName?.charAt(0)?.toUpperCase() || 'N'}</div>
            <label className="image-picker">Choose profile image<input type="file" accept="image/*" onChange={handleImageChange} /></label>
            {selectedImage && <p className="file-note">{selectedImage.name}</p>}
            <p className="profile-email">{user?.email}</p>
          </section>

          <section className="profile-card profile-form-card">
            <div className="card-label"><span className="card-number">02</span> PERSONAL DETAILS</div>
            <div className="profile-fields">
              <label>Full name<input name="fullName" value={form.fullName} onChange={handleChange} required /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
              <label>Phone<input name="phone" type="tel" value={form.phone} onChange={handleChange} required /></label>
            </div>
            <div className="card-label address-label"><span className="card-number">03</span> DEFAULT DELIVERY ADDRESS</div>
            <div className="profile-fields address-fields">
              <label className="field-wide">Street address<input name="street" value={form.street} onChange={handleChange} placeholder="Apartment, building and street" /></label>
              <label>City<input name="city" value={form.city} onChange={handleChange} /></label>
              <label>Postal code<input name="postalCode" value={form.postalCode} onChange={handleChange} /></label>
              <label>Country<input name="country" value={form.country} onChange={handleChange} /></label>
            </div>
            <button className="button button-accent profile-save" type="submit" disabled={saving}>{saving ? (uploading ? 'Uploading image...' : 'Saving changes...') : 'Save profile'}</button>
          </section>
        </form>
      </section>
    </main>
  )
}

export default CustomerProfile
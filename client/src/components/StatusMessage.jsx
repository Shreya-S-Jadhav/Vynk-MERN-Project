function StatusMessage({ message, type = 'error' }) {
  if (!message) return null

  return (
    <div
      className={type === 'success' ? 'profile-success' : 'auth-error'}
      role={type === 'error' ? 'alert' : 'status'}
      style={
        type === 'error'
          ? {
              backgroundColor: '#fff5f5',
              border: '1px solid #feb2b2',
              color: '#c53030',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '14px',
            }
          : undefined
      }
    >
      {message}
    </div>
  )
}

export default StatusMessage

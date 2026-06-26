import { useContext, useEffect } from 'react'
import { ErrorContext } from './ErrorContext'

const ErrorBanner = () => {
  const { error, clearError } = useContext(ErrorContext)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  if (!error) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px 20px',
        borderBottom: '1px solid #f5c6cb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <span>{error}</span>
      <button
        onClick={clearError}
        style={{
          background: 'none',
          border: 'none',
          color: '#721c24',
          cursor: 'pointer',
          fontSize: '20px',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  )
}

export default ErrorBanner

//banner eroare din LibraryPage si AddBookPage
import { colors } from '../theme'

export default function ErrorBanner({ message }) {
  if (!message) return null

  return (
    <div style={{
      background: '#fdf0f0',
      border: `1px solid ${colors.berry}`,
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '13px',
      color: colors.berry,
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        background: colors.berry,
        borderRadius: '50%',
        flexShrink: 0,
      }} />
      {message}
    </div>
  )
}
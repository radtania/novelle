import { colors } from '../theme'

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.cream,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: '"Playfair Display", serif',
        color: colors.warmOak,
        fontSize: '18px',
      }}>
        {message}
      </span>
    </div>
  )
}

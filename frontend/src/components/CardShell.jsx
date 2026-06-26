//din StatisticsPage
import { colors } from '../theme'

export default function CardShell({ accentColor, title, children }) {
  return (
    <div style={{
      background: colors.cream,
      border: `1px solid ${colors.linen}`,
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0.9rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        borderBottom: `1px solid ${colors.parchment}`,
      }}>
        <div style={{
          width: '4px',
          height: '18px',
          borderRadius: '4px',
          background: accentColor,
          flexShrink: 0,
        }} />
        <div style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '15px',
          color: colors.ink,
          fontWeight: 400,
        }}>
          {title}
        </div>
      </div>
      <div style={{ padding: '1.2rem 1.4rem' }}>
        {children}
      </div>
    </div>
  )
}
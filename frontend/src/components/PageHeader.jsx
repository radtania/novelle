import { colors } from '../theme'

export default function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: '26px',
        color: colors.ink,
        fontWeight: 400,
        marginBottom: '4px',
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#9c7a52' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
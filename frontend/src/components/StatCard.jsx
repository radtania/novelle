import { colors } from '../theme'
//din DashboardPage
export default function StatCard({ value, label, bg, icon }) {
  return (
    <div style={{
      background: bg,
      borderRadius: '12px',
      padding: '1.2rem 1.4rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        background: '#ffffff18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '28px',
          color: colors.cream,
          fontWeight: 400,
          lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '10px',
          color: `${colors.cream}aa`,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '3px',
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}
//status din LibraryPage si DashboardPage
import { colors, statusColor, statusLabel } from '../theme'

export default function StatusBadge({ status, light = false }) {
  const bg = statusColor[status] || colors.linen

  if (light) {
    // versiune light: text colorat pe fundal pastel, folosita in LibraryPage recent books
    const lightBg = {
      'read': '#e4ede0',
      'currently-reading': '#f5ede0',
      'to-read': '#e0e4ec',
    }
    return (
      <div style={{
        fontSize: '10px',
        padding: '3px 9px',
        borderRadius: '20px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 700,
        background: lightBg[status] || colors.parchment,
        color: bg,
      }}>
        {statusLabel[status] || status}
      </div>
    )
  }

  return (
    <div style={{
      fontSize: '10px',
      padding: '4px 11px',
      borderRadius: '20px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 700,
      background: bg,
      color: colors.cream,
    }}>
      {statusLabel[status] || status}
    </div>
  )
}
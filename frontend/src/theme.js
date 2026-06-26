export const colors = {
  parchment: '#F1E4CC',
  warmOak: '#A57650',
  umberBrown: '#8C6046',
  berry: '#851C24',
  blueberry: '#414757',
  sage: '#84896D',
  linen: '#D5B38E',
  cream: '#fdf8f0',
  ink: '#2C2725',
}

export const statusColor = {
  'read': colors.sage,
  'currently-reading': colors.warmOak,
  'to-read': colors.blueberry,
}

export const statusLabel = {
  'read': 'Read',
  'currently-reading': 'Reading',
  'to-read': 'To Read',
}

export const inputStyle = {
  width: '100%',
  background: colors.parchment,
  border: `1px solid ${colors.linen}`,
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '13px',
  color: colors.ink,
  fontFamily: "'Lato', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
}

export const labelStyle = {
  fontSize: '10px',
  color: colors.umberBrown,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '6px',
  fontWeight: 700,
  display: 'block',
}


export function starsDisplay(rating) {
  const filled = Math.round(rating || 0)
  return '★'.repeat(filled) + '☆'.repeat(5 - filled)
}

//din AddBookPage
import { labelStyle } from '../theme'

export default function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}
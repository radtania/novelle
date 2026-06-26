import { useState } from 'react'
import { profileApi } from '../api/api'
import { colors, inputStyle, labelStyle } from '../theme'

//PROFILE MODAL
function ProfileModal({ onClose, onNameUpdate }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  const email = document.cookie
    .split('; ')
    .find(row => row.startsWith('session_email='))
    ?.split('=')[1] || ''

  const handleSaveName = async () => {
    if (!name.trim()) { setError('Name cannot be empty.'); return }
    setError('')
    setLoading(true)
    try {
      await profileApi.updateName(name.trim())
      setSuccess('Name updated successfully!')
      onNameUpdate(name.trim())
      setTimeout(() => setSuccess(''), 2500)
    } catch (e) {
      setError(e.message || 'Could not update name.')
    }
    setLoading(false)
  }

  const handleChangePassword = async () => {
    setPwError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('All fields are required.'); return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.'); return
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.'); return
    }
    setPwLoading(true)
    try {
      await profileApi.changePassword(currentPassword, newPassword)
      setPwSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(''), 2500)
    } catch (e) {
      setPwError(e.message || 'Could not change password.')
    }
    setPwLoading(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: '#00000044', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '16px', width: '440px', maxWidth: '90vw', overflow: 'hidden' }}>

        <div style={{ background: colors.blueberry, padding: '1.4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', color: colors.cream, fontWeight: 400 }}>My Profile</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: `${colors.linen}aa`, fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '1.8rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.8rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${colors.parchment}` }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: colors.berry, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display", serif', fontSize: '22px', color: colors.cream, fontWeight: 400, flexShrink: 0 }}>
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', color: colors.ink, marginBottom: '2px' }}>
                {localStorage.getItem('userName') || email.split('@')[0]}
              </div>
              <div style={{ fontSize: '12px', color: '#9c7a52' }}>{email}</div>
            </div>
          </div>

          {success && <div style={{ background: '#e4ede0', border: '1px solid #84896D', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#84896D', marginBottom: '1rem' }}>{success}</div>}
          {error && <div style={{ background: '#fdf0f0', border: `1px solid ${colors.berry}`, borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: colors.berry, marginBottom: '1rem' }}>{error}</div>}

          <div style={{ marginBottom: '1.8rem', paddingBottom: '1.8rem', borderBottom: `1px solid ${colors.parchment}` }}>
            <div style={{ fontSize: '10px', color: colors.umberBrown, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '3px', height: '12px', borderRadius: '3px', background: colors.warmOak }} />
              Change name
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>New name</label>
              <input style={inputStyle} placeholder="Enter your new name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveName()} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveName} disabled={loading} style={{ background: colors.warmOak, color: colors.cream, border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Save name'}
              </button>
            </div>
          </div>

          {pwSuccess && <div style={{ background: '#e4ede0', border: '1px solid #84896D', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#84896D', marginBottom: '1rem' }}>{pwSuccess}</div>}
          {pwError && <div style={{ background: '#fdf0f0', border: `1px solid ${colors.berry}`, borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: colors.berry, marginBottom: '1rem' }}>{pwError}</div>}

          <div>
            <div style={{ fontSize: '10px', color: colors.umberBrown, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '3px', height: '12px', borderRadius: '3px', background: colors.warmOak }} />
              Change password
            </div>
            <div style={{ marginBottom: '0.8rem' }}>
              <label style={labelStyle}>Current password</label>
              <input style={inputStyle} type="password" placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>New password</label>
                <input style={inputStyle} type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input style={inputStyle} type="password" placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChangePassword()} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleChangePassword} disabled={pwLoading} style={{ background: colors.blueberry, color: colors.cream, border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer', opacity: pwLoading ? 0.7 : 1 }}>
                {pwLoading ? 'Saving...' : 'Change password'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfileModal
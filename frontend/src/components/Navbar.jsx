import { useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi} from '../api/api'
import { colors} from '../theme'
import logo from '../assets/logo.svg'
import SearchBar from './SearchBar'
import AddBookModal from './AddBookModal'
import ProfileModal from './ProfileModal'


// NAVBAR
export default function Navbar({ activePage, onLogout }) {
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [userName, setUserName] = useState(
    () => localStorage.getItem('userName') || ''
  )

  const handleLogout = async () => {
    try { await authApi.logout() } catch (e) {}
    onLogout()
    navigate('/login')
  }

  const handleNameUpdate = (newName) => {
    setUserName(newName)
    localStorage.setItem('userName', newName)
  }

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Library', path: '/library' },
    { label: 'Recommendations', path: '/recommendations' },
    { label: 'Statistics', path: '/statistics' },
  ]

  const email = document.cookie
    .split('; ')
    .find(row => row.startsWith('session_email='))
    ?.split('=')[1] || ''
  const initial = (userName || email).charAt(0).toUpperCase()
  const displayName = userName || email.split('@')[0]

  return (
    <>
      <nav style={{ background: colors.warmOak, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', borderBottom: `1px solid ${colors.umberBrown}`, position: 'sticky', top: 0, zIndex: 100 }}>

        {/* Logo */}
        <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <img src={logo} alt="Novelle" style={{ width: '28px', height: '28px', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', color: colors.cream, fontWeight: 400, letterSpacing: '0.06em' }}>Novelle</span>
        </div>

        {/* Search + Add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SearchBar />
          <button
            onClick={() => navigate('/add-book')}
            style={{ background: colors.berry, color: colors.cream, border: 'none', borderRadius: '8px', width: '34px', height: '34px', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300, lineHeight: 1 }}
          >+</button>
        </div>

        {/* Nav links + profile + signout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{ fontSize: '11px', color: activePage === link.label.toLowerCase() ? colors.cream : `${colors.cream}aa`, padding: '6px 11px', borderRadius: '6px', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none', background: activePage === link.label.toLowerCase() ? colors.umberBrown : 'transparent' }}>
              {link.label}
            </Link>
          ))}

          <div style={{ width: '1px', height: '20px', background: colors.umberBrown, margin: '0 6px' }} />

          <div onClick={() => setShowProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '4px 10px', borderRadius: '8px', border: `1px solid ${colors.umberBrown}` }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: colors.berry, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: colors.cream, fontWeight: 700 }}>{initial}</div>
            <span style={{ fontSize: '11px', color: colors.cream, letterSpacing: '0.04em' }}>{displayName}</span>
            <span style={{ fontSize: '9px', color: colors.linen }}>▾</span>
          </div>

          <button onClick={handleLogout} style={{ fontSize: '11px', color: `${colors.cream}cc`, background: 'transparent', border: `1px solid ${colors.umberBrown}`, borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontFamily: "'Lato', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.linen} strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </nav>

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} onNameUpdate={handleNameUpdate} />
      )}
    </>
  )
}
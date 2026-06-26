import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { booksApi, profileApi } from '../api/api'
import { colors, statusColor } from '../theme'
import StatCard from '../components/StatCard'
import PageLoader from '../components/PageLoader'
import StatusBadge from '../components/StatusBadge'

export default function DashboardPage({ onLogout }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
  const load = async () => {
    try {
      const statsData = await booksApi.getStats()
      setStats(statsData)
    } catch (e) {}

    try {
      const profileData = await profileApi.getProfile()
      setUserName(profileData.name)
    } catch (e) {}

    setLoading(false)
  }
  load()
}, [])

  const totalRead = stats?.total_read || 0
  const totalPages = stats?.total_pages || 0
  const avgRating = stats?.avg_rating ? stats.avg_rating.toFixed(1) : '—'
  const totalBooks = stats?.total_books || 0
  const recentBooks = stats?.recently_added || []
  const currentlyReading = stats?.currently_reading || null

  if (loading) return <PageLoader message="Loading your library..." />

  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Lato', sans-serif" }}>
      <Navbar activePage="dashboard" onLogout={onLogout} />

      <div style={{ padding: '2rem 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Greeting */}
        <div style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '27px', color: colors.ink, fontWeight: 400, marginBottom: '3px',
        }}>
          Hello, {userName}
        </div>
        <div style={{ fontSize: '13px', color: '#9c7a52', marginBottom: '2rem' }}>
          You have {totalBooks} books in your library - keep turning pages.
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.4rem' }}>
          <StatCard
            value={totalRead}
            label="Books read this year"
            bg={colors.warmOak}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
          />
          <StatCard
            value={totalPages.toLocaleString()}
            label="Pages read"
            bg={colors.blueberry}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
          />
          <StatCard
            value={avgRating}
            label="Avg rating"
            bg={colors.sage}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>

          {/* Currently Reading */}
          <div style={{ background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '12px', padding: '1.3rem 1.4rem' }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '16px', color: colors.ink, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.warmOak} strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Currently Reading
            </div>
            {currentlyReading ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '58px', height: '82px', borderRadius: '5px', background: '#e8ecf4', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.blueberry} strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '15px', color: colors.ink, marginBottom: '3px' }}>{currentlyReading.title}</div>
                  <div style={{ fontSize: '12px', color: '#9c7a52', marginBottom: '10px' }}>{currentlyReading.author}</div>
                  <div style={{ fontSize: '11px', color: colors.umberBrown, marginBottom: '5px', fontWeight: 700 }}>In progress</div>
                  <div style={{ width: '100%', height: '7px', background: colors.parchment, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '42%', borderRadius: '10px', background: `linear-gradient(90deg, ${colors.warmOak}, ${colors.berry})` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52' }}>
                  No book in progress yet.
                </div>
                <div
                  onClick={() => navigate('/library')}
                  style={{ fontSize: '11px', color: colors.warmOak, marginTop: '8px', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.06em' }}
                >
                  Pick one from your library →
                </div>
              </div>
            )}
          </div>

          {/* AI Recommendation */}
          <div style={{ background: colors.berry, border: '1px solid #6e1720', borderRadius: '12px', padding: '1.3rem 1.4rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '16px', top: '14px', opacity: 0.1 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '16px', color: colors.cream, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.linen} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Your AI Recommendation
            </div>
            <div style={{ fontSize: '12px', color: `${colors.cream}88`, marginBottom: '1rem', lineHeight: 1.6 }}>
              Based on your reading history, Novelle thinks you'll love:
            </div>
            <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: `${colors.cream}77`, marginBottom: '1rem' }}>
              Generate your first recommendation!
            </div>
            <button
              onClick={() => navigate('/recommendations')}
              style={{ background: 'transparent', border: `1px solid ${colors.linen}`, borderRadius: '8px', color: colors.linen, padding: '7px 16px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer' }}
            >
              Get recommendation →
            </button>
          </div>
        </div>

        {/* Recently Added */}
        <div style={{ background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '12px', padding: '1.3rem 1.4rem' }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '16px', color: colors.ink, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.warmOak} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Recently Added
          </div>
          {recentBooks.length === 0 ? (
            <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52', textAlign: 'center', padding: '1rem 0' }}>
              Your library is empty. Add your first book!
            </div>
          ) : recentBooks.map((book, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.65rem 0', borderBottom: i < recentBooks.length - 1 ? `1px solid ${colors.parchment}` : 'none' }}>
              <div style={{ width: '3px', height: '38px', borderRadius: '3px', background: statusColor[book.status] || colors.linen, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', color: colors.ink, fontFamily: '"Playfair Display", serif' }}>{book.title}</div>
                <div style={{ fontSize: '11px', color: '#9c7a52' }}>{book.author}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <StatusBadge status={book.status} light />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
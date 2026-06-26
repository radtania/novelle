import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { booksApi } from '../api/api'
import { colors, starsDisplay } from '../theme'
import CardShell from '../components/CardShell'
import PageLoader from '../components/PageLoader'
import PageHeader from '../components/PageHeader'

export default function StatisticsPage({ onLogout }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('readingGoal')) || 30)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(goal)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await booksApi.getStats()
        setStats(data)
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const currentYear = new Date().getFullYear()

  const saveGoal = () => {
    const val = Math.max(1, Number(goalInput))
    setGoal(val)
    localStorage.setItem('readingGoal', val)
    setEditingGoal(false)
  }

  if (loading) return <PageLoader message="Loading your statistics..." />

  const totalRead = stats?.total_read || 0
  const totalPages = stats?.total_pages || 0
  const avgPages = stats?.avg_pages || 0
  const ratingDistribution = stats?.rating_distribution || [0, 0, 0, 0, 0]
  const topAuthors = stats?.top_authors || []
  const topBooks = stats?.top_books || []
  const statusBreakdown = stats?.status_breakdown || {}

  const goalPct = Math.min(Math.round((totalRead / goal) * 100), 100)
  const maxRating = Math.max(...ratingDistribution, 1)
  const maxAuthorCount = topAuthors[0]?.count || 1

  const statusData = [
    { label: 'Read', count: statusBreakdown['read'] || 0, color: colors.sage },
    { label: 'Reading', count: statusBreakdown['currently-reading'] || 0, color: colors.warmOak },
    { label: 'To Read', count: statusBreakdown['to-read'] || 0, color: colors.blueberry },
  ]
  const totalBooks = statusData.reduce((sum, s) => sum + s.count, 0)
  const maxStatus = Math.max(...statusData.map(s => s.count), 1)

  return (
    <div style={{ minHeight: '100vh', background: '#f5e8d6', fontFamily: "'Lato', sans-serif" }}>
      <Navbar activePage="statistics" onLogout={onLogout} />

      <div style={{ padding: '2rem 2.5rem', maxWidth: '1050px', margin: '0 auto' }}>

        <PageHeader
          title="Your Reading Statistics"
          subtitle={`A look at your reading life in numbers · ${currentYear}`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* GOAL */}
          <CardShell accentColor={colors.blueberry} title={`Reading goal · ${currentYear}`}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '38px', color: colors.ink, fontWeight: 400, lineHeight: 1 }}>
                  {totalRead}
                </span>
                <span style={{ fontSize: '13px', color: '#9c7a52', marginLeft: '4px' }}>/ {goal} books</span>
              </div>
              <span
                onClick={() => { setEditingGoal(true); setGoalInput(goal) }}
                style={{ fontSize: '10px', color: '#9c7a52', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Edit goal
              </span>
            </div>

            {editingGoal && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="number" min="1"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  style={{ flex: 1, background: colors.parchment, border: `1px solid ${colors.linen}`, borderRadius: '6px', padding: '6px 10px', fontSize: '13px', color: colors.ink, outline: 'none' }}
                />
                <button
                  onClick={saveGoal}
                  style={{ background: colors.blueberry, color: colors.cream, border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer' }}
                >Save</button>
              </div>
            )}

            <div style={{ width: '100%', height: '8px', background: colors.parchment, borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ height: '100%', width: `${goalPct}%`, borderRadius: '10px', background: `linear-gradient(90deg, ${colors.blueberry}, ${colors.berry})` }} />
            </div>
            <div style={{ fontSize: '11px', color: '#9c7a52' }}>
              {goalPct}% complete · {Math.max(goal - totalRead, 0)} books to go
            </div>
          </CardShell>

          {/* PAGES */}
          <CardShell accentColor={colors.berry} title={`Pages read · all time`}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '38px', color: colors.ink, fontWeight: 400, lineHeight: 1, marginBottom: '4px' }}>
              {totalPages.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#9c7a52', letterSpacing: '0.1em', textTransform: 'uppercase' }}>total pages</div>
            <div style={{ fontSize: '12px', color: '#b09070', marginTop: '8px', fontStyle: 'italic', fontFamily: '"Playfair Display", serif' }}>
              {avgPages > 0 ? `avg. ${avgPages} pages per book` : 'Add read books to see stats'}
            </div>
          </CardShell>

          {/* RATING DISTRIBUTION */}
          <CardShell accentColor={colors.warmOak} title="Rating distribution">
            {totalRead === 0 ? (
              <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52', textAlign: 'center', padding: '1rem 0' }}>
                No rated books yet
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px', marginBottom: '8px' }}>
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <div key={star} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '10px', color: colors.ink, fontWeight: 700 }}>{ratingDistribution[i]}</div>
                    <div style={{
                      width: '100%',
                      height: `${Math.max((ratingDistribution[i] / maxRating) * 100, 4)}%`,
                      borderRadius: '4px 4px 0 0',
                      background: ['#F1E4CC', '#D5B38E', '#A57650', '#8C6046', '#851C24'][i],
                    }} />
                    <div style={{ fontSize: '10px', color: '#9c7a52' }}>★{star}</div>
                  </div>
                ))}
              </div>
            )}
          </CardShell>

          {/* TOP AUTHORS */}
          <CardShell accentColor={colors.sage} title="Top authors">
            {topAuthors.length === 0 ? (
              <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52', textAlign: 'center', padding: '1rem 0' }}>
                No books yet
              </div>
            ) : topAuthors.map((a, i) => (
              <div key={a.author} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 0', borderBottom: i < topAuthors.length - 1 ? `1px solid ${colors.parchment}` : 'none' }}>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '14px', color: colors.linen, width: '20px', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: '13px', color: colors.ink, fontFamily: '"Playfair Display", serif' }}>{a.author}</div>
                <div style={{ fontSize: '11px', color: '#9c7a52', marginRight: '6px' }}>{a.count} {a.count === 1 ? 'book' : 'books'}</div>
                <div style={{ width: '60px', height: '4px', background: colors.parchment, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(a.count / maxAuthorCount) * 100}%`, background: colors.sage, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </CardShell>

          {/* STATUS BREAKDOWN */}
          <CardShell accentColor={colors.linen} title="Status breakdown">
            {totalBooks === 0 ? (
              <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52', textAlign: 'center', padding: '1rem 0' }}>
                No books yet
              </div>
            ) : statusData.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: i < statusData.length - 1 ? '0.75rem' : 0 }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: '12px', color: colors.ink }}>{s.label}</div>
                <div style={{ flex: 2, height: '5px', background: colors.parchment, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(s.count / maxStatus) * 100}%`, background: s.color, borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#9c7a52', fontWeight: 700, width: '50px', textAlign: 'right' }}>
                  {s.count} {s.count === 1 ? 'book' : 'books'}
                </div>
              </div>
            ))}
          </CardShell>

          {/* TOP 5 BOOKS */}
          <CardShell accentColor={colors.berry} title="Top 5 favourite books">
            {topBooks.length === 0 ? (
              <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52', textAlign: 'center', padding: '1rem 0' }}>
                Rate your books to see your top 5
              </div>
            ) : topBooks.map((book, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 0', borderBottom: i < topBooks.length - 1 ? `1px solid ${colors.parchment}` : 'none' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: i < 2 ? '#f5ede0' : colors.parchment,
                  color: i < 2 ? colors.warmOak : colors.umberBrown,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: colors.ink, fontFamily: '"Playfair Display", serif' }}>{book.title}</div>
                  <div style={{ fontSize: '11px', color: '#9c7a52' }}>{book.author}</div>
                </div>
                <div style={{ fontSize: '12px', color: colors.warmOak, letterSpacing: '1px', flexShrink: 0 }}>
                  {starsDisplay(book.my_rating)}
                </div>
              </div>
            ))}
          </CardShell>

        </div>
      </div>
    </div>
  )
}
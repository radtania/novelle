import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { booksApi } from '../api/api'
import { colors, statusColor, starsDisplay} from '../theme'
import EditModal from '../components/EditModal'
import ErrorBanner from '../components/ErrorBanner'
import StatusBadge from '../components/StatusBadge'
import PageLoader from '../components/PageLoader'
import PageHeader from '../components/PageHeader'

export default function LibraryPage({ onLogout }) {
  const [books, setBooks] = useState([])
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await booksApi.getAll()
        setBooks(data || [])
      } catch (e) {
        setError('Could not load books.')
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all'
    ? books
    : books.filter(b => b.status === filter)

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title-az') return a.title.localeCompare(b.title)
    if (sort === 'title-za') return b.title.localeCompare(a.title)
    return new Date(a.added_at) - new Date(b.added_at)
  })

  const count = (status) => books.filter(b => b.status === status).length

  const handleDelete = async (bookId) => {
    if (!window.confirm('Delete this book from your library?')) return
    try {
      await booksApi.delete(bookId)
      setBooks(prev => prev.filter(b => b.id !== bookId))
    } catch (e) {
      alert('Could not delete book.')
    }
  }

  const handleSave = async (form) => {
  try {
    const readAt = form.status === 'read' && form.read_at
      ? form.read_at + 'T12:00:00.000Z'
      : null

    await booksApi.update(editingBook.id, {
      my_rating: Number(form.my_rating),
      status: form.status,
      review: form.review,
      read_at: readAt,
    })
    setBooks(prev => prev.map(b =>
      b.id === editingBook.id
        ? { ...b, my_rating: Number(form.my_rating), status: form.status, review: form.review, read_at: readAt }
        : b
    ))
    setEditingBook(null)
  } catch (e) {
    alert('Could not update book.')
  }
}

  const chipStyle = (chipFilter, color) => ({
    fontSize: '11px',
    padding: '6px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: 700,
    border: `1.5px solid ${color}`,
    color: filter === chipFilter ? colors.cream : color,
    background: filter === chipFilter ? color : 'transparent',
    fontFamily: "'Lato', sans-serif",
  })

  if (loading) return <PageLoader message="Loading your library..." />

  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Lato', sans-serif" }}>
      <Navbar activePage="library" onLogout={onLogout} />

      <div style={{ padding: '2rem 2.5rem', maxWidth: '900px', margin: '0 auto' }}>

        <PageHeader
          title="My Library"
          subtitle={`${books.length} ${books.length === 1 ? 'book' : 'books'} in your collection`}
        />

        <ErrorBanner message={error} />

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button style={chipStyle('all', colors.warmOak)} onClick={() => setFilter('all')}>
            All ({books.length})
          </button>
          <button style={chipStyle('read', colors.sage)} onClick={() => setFilter('read')}>
            Read ({count('read')})
          </button>
          <button style={chipStyle('currently-reading', colors.warmOak)} onClick={() => setFilter('currently-reading')}>
            Reading ({count('currently-reading')})
          </button>
          <button style={chipStyle('to-read', colors.blueberry)} onClick={() => setFilter('to-read')}>
            To Read ({count('to-read')})
          </button>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              marginLeft: 'auto',
              fontSize: '11px', fontFamily: "'Lato', sans-serif",
              fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: `1.5px solid ${colors.linen}`,
              borderRadius: '20px',
              padding: '6px 14px',
              color: colors.umberBrown,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
            }}
          >
            <option value="recent">Recent first</option>
            <option value="title-az">Title A → Z</option>
            <option value="title-za">Title Z → A</option>
          </select>
        </div>

        {/* Books list */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '16px', color: '#9c7a52' }}>
              No books here yet.
            </div>
          </div>
        ) : sorted.map((book, i) => (
          <div key={book.id || i} style={{
            background: colors.cream,
            border: `1px solid ${colors.linen}`,
            borderRadius: '12px',
            padding: '1rem 1.4rem',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}>
            {/* Spine */}
            <div style={{
              width: '5px', minHeight: '60px',
              borderRadius: '4px',
              background: statusColor[book.status] || colors.linen,
              alignSelf: 'stretch', flexShrink: 0,
            }} />

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '15px', color: colors.ink, marginBottom: '2px' }}>
                {book.title}
              </div>
              <div style={{ fontSize: '12px', color: '#9c7a52', marginBottom: '4px' }}>
                {book.author}{book.number_of_pages ? ` · ${book.number_of_pages} pages` : ''}{book.average_rating ? ` · ★ ${book.average_rating.toFixed(1)}` : ''}
              </div>
                {book.review && (
              <div style={{ fontSize: '12px', color: colors.umberBrown, fontStyle: 'italic', lineHeight: 1.5, marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                "{book.review.replace(/<br\s*\/?>/gi, '\n')}"
              </div>
            )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              <div style={{ color: book.my_rating ? colors.warmOak : colors.linen, fontSize: '12px', letterSpacing: '1px' }}>
                {starsDisplay(book.my_rating)}
              </div>
              <StatusBadge status={book.status} />
              {book.read_at && new Date(book.read_at).getFullYear() > 1 && (
                <div style={{ fontSize: '11px', color: '#b09070' }}>
                  {new Date(book.read_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              )}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={() => setEditingBook(book)}
                  style={{
                    background: colors.blueberry, color: colors.cream,
                    border: 'none', borderRadius: '6px',
                    padding: '5px 12px', fontSize: '10px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700, cursor: 'pointer',
                  }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(book.id)}
                  style={{
                    background: colors.berry, color: colors.cream,
                    border: 'none', borderRadius: '6px',
                    padding: '5px 12px', fontSize: '10px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700, cursor: 'pointer',
                  }}
                >Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingBook && (
        <EditModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
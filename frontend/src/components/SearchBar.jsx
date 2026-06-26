import { useState, useRef, useEffect } from 'react'
import { colors } from '../theme'
import AddBookModal from './AddBookModal'
import { booksApi } from '../api/api'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const debounceRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const searchBooks = async (q) => {
    if (!q.trim() || q.length < 2) { setResults([]); setShowDropdown(false); return }
    setLoading(true)
    try {
      const books = await booksApi.search(q)
      setResults(books)
      setShowDropdown(true)
    } catch (e) {
      setResults([])
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchBooks(val), 400)
  }

  const handleSelect = (book) => {
    setSelectedBook(book)
    setShowDropdown(false)
  }

  const handleAdded = () => {
    setQuery('')
    setResults([])
    setSelectedBook(null)
  }

  return (
    <>
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: colors.umberBrown, border: '1px solid #6b4530', borderRadius: '8px', padding: '7px 14px', gap: '8px', width: '280px' }}>
          {loading
            ? <div style={{ width: '13px', height: '13px', border: `2px solid ${colors.linen}`, borderTopColor: 'transparent', borderRadius: '50%', flexShrink: 0, animation: 'spin 0.6s linear infinite' }} />
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.linen} strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
          }
          <input
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            placeholder="Search books..."
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: colors.linen, width: '100%', fontFamily: "'Lato', sans-serif", letterSpacing: '0.04em' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setShowDropdown(false) }} style={{ background: 'none', border: 'none', color: `${colors.linen}88`, cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 }}>✕</button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && results.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '360px', background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px #00000022', zIndex: 200 }}>
            <div style={{ padding: '8px 14px', fontSize: '10px', color: '#9c7a52', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, borderBottom: `1px solid ${colors.parchment}` }}>
              Results for "{query}"
            </div>
            {results.map((book, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.75rem 1rem', borderBottom: i < results.length - 1 ? `1px solid ${colors.parchment}` : 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5ede0'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '32px', height: '44px', borderRadius: '3px', background: '#e0e4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.blueberry} strokeWidth="1.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '13px', color: colors.ink, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</div>
                  <div style={{ fontSize: '11px', color: '#9c7a52' }}>{book.author}</div>
                  <div style={{ fontSize: '10px', color: '#b09070', marginTop: '2px' }}>
                    {book.pages ? `${book.pages} pages` : ''}{book.year ? ` · ${book.year}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => handleSelect(book)}
                  style={{ background: colors.warmOak, color: colors.cream, border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {showDropdown && results.length === 0 && !loading && query.length >= 2 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '360px', background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '12px', padding: '1rem', textAlign: 'center', zIndex: 200 }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '13px', color: '#9c7a52' }}>No books found for "{query}"</div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {selectedBook && (
        <AddBookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAdded={handleAdded}
        />
      )}
    </>
  )
}
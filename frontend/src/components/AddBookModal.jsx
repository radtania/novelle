import { useState, useRef, useEffect } from "react"
import { colors, inputStyle, labelStyle } from '../theme'
import { booksApi } from '../api/api'
// ADD BOOK MODAL


export default function AddBookModal({ book, onClose, onAdded }) {
  const [status, setStatus] = useState('to-read')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [readAt, setReadAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    setLoading(true)
    setError('')
    try {
      await booksApi.create({
        title: book.title,
        author: book.author,
        number_of_pages: book.pages || 0,
        average_rating: 0,
        status,
        my_rating: status !== 'read' ? 0 : Number(rating),
        review,
        read_at: status === 'read' && readAt
        ? readAt + 'T12:00:00.000Z'
        : null,
      })
      onAdded()
      onClose()
    } catch (e) {
      setError('Could not add book. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: '#00000044', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '16px', width: '440px', maxWidth: '90vw', overflow: 'hidden' }}>

        <div style={{ background: colors.blueberry, padding: '1.2rem 1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '17px', color: colors.cream, fontWeight: 400 }}>Add to your library</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: `${colors.cream}aa`, fontSize: '16px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '1.6rem 1.8rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.4rem', paddingBottom: '1.4rem', borderBottom: `1px solid ${colors.parchment}` }}>
            <div style={{ width: '48px', height: '66px', borderRadius: '4px', background: '#e0e4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.blueberry} strokeWidth="1.5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '17px', color: colors.ink, marginBottom: '3px' }}>{book.title}</div>
              <div style={{ fontSize: '12px', color: '#9c7a52', fontStyle: 'italic', fontFamily: '"Playfair Display", serif' }}>{book.author}</div>
              <div style={{ fontSize: '11px', color: '#b09070', marginTop: '4px' }}>
                {book.pages ? `${book.pages} pages` : ''}{book.year ? ` · ${book.year}` : ''}
              </div>
            </div>
          </div>

          {error && <div style={{ background: '#fdf0f0', border: `1px solid ${colors.berry}`, borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: colors.berry, marginBottom: '1rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, appearance: 'none' }} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="to-read">To Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="read">Read</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>My Rating (0–5)</label>
              <input
                style={{ ...inputStyle, opacity: status !== 'read' ? 0.4 : 1, cursor: status !== 'read' ? 'not-allowed' : 'text' }}
                type="number" min="0" max="5" placeholder="0"
                value={status !== 'read' ? '' : rating}
                disabled={status !== 'read'}
                onChange={e => setRating(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Review (optional)</label>
            <textarea style={{ ...inputStyle, resize: 'none' }} rows={2} placeholder="Your thoughts..." value={review} onChange={e => setReview(e.target.value)} />
          </div>

        {status === 'read' && (
          <div style={{ marginTop: '1rem' }}>
            <label style={labelStyle}>Date read</label>
            <input
              style={inputStyle}
              type="date"
              value={readAt}
              onChange={e => setReadAt(e.target.value)}
            />
          </div>
        )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={onClose} style={{ background: 'transparent', color: '#9c7a52', border: `1px solid ${colors.linen}`, borderRadius: '8px', padding: '10px 16px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleAdd} disabled={loading} style={{ background: colors.berry, color: colors.cream, border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Adding...' : 'Add to library'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
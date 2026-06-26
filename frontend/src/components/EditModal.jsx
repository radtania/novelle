import { useState } from 'react'
import { colors, inputStyle, labelStyle } from '../theme'

export default function EditModal({ book, onClose, onSave }) {
  const [form, setForm] = useState({
    title: book.title || '',
    author: book.author || '',
    my_rating: book.my_rating || 0,
    status: book.status || 'to-read',
    review: book.review || '',
    read_at: book.read_at ? new Date(book.read_at).toISOString().split('T')[0] : '',
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#00000055',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200,
    }}>
      <div style={{
        background: colors.cream,
        border: `1px solid ${colors.linen}`,
        borderRadius: '16px',
        padding: '2rem',
        width: '480px',
        maxWidth: '90vw',
      }}>
        <div style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '20px', color: colors.ink,
          marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
        }}>
          <div style={{ width: '4px', height: '22px', background: colors.warmOak, borderRadius: '4px' }} />
          Edit Book
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={{
                ...inputStyle,
                opacity: 0.4,
                cursor: 'not-allowed',
              }}
              value={form.title}
              disabled
              readOnly
            />
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input
              style={{
                ...inputStyle,
                opacity: 0.4,
                cursor: 'not-allowed',
              }}
              value={form.author}
              disabled
              readOnly
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>My Rating (1–5)</label>
            <input
              style={{
                ...inputStyle,
                opacity: form.status !== 'read' ? 0.4 : 1,
                cursor: form.status !== 'read' ? 'not-allowed' : 'text',
              }}
              type="number" min="0" max="5"
              placeholder={form.status !== 'read' ? 'Finish the book first' : '0'}
              value={form.status !== 'read' ? '' : form.my_rating}
              disabled={form.status !== 'read'}
              onChange={set('my_rating')}
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.status} onChange={set('status')}>
              <option value="read">Read</option>
              <option value="currently-reading">Currently Reading</option>
              <option value="to-read">To Read</option>
            </select>
          </div>
        </div>

        {form.status === 'read' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Date read</label>
            <input
              style={inputStyle}
              type="date"
              value={form.read_at}
              onChange={set('read_at')}
            />
          </div>
        )}

        <label style={labelStyle}>Review</label>
        <textarea
          style={{ ...inputStyle, resize: 'none' }}
          rows={3}
          value={form.review}
          onChange={set('review')}
        />

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', color: '#9c7a52',
              border: `1px solid ${colors.linen}`,
              borderRadius: '8px', padding: '10px 20px',
              fontSize: '12px', letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700, cursor: 'pointer',
            }}
          >Cancel</button>
          <button
            onClick={() => onSave(form)}
            style={{
              background: colors.warmOak, color: colors.cream,
              border: 'none', borderRadius: '8px',
              padding: '10px 20px', fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700, cursor: 'pointer',
            }}
          >Save changes</button>
        </div>
      </div>
    </div>
  )
}
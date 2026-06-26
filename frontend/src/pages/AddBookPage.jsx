import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { booksApi } from '../api/api'
import { colors, inputStyle } from '../theme'
import FormField from '../components/FormField'
import ErrorBanner from '../components/ErrorBanner'
import PageLoader from '../components/PageLoader'
import PageHeader from '../components/PageHeader'



function ManualTab({ onLogout }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    author: '',
    status: 'to-read',
    my_rating: 0,
    number_of_pages: '',
    review: '',
    read_at: '',
    published_at: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.title || !form.author) {
      setError('Title and author are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
  const readAt = form.status === 'read' && form.read_at
    ? form.read_at + 'T12:00:00.000Z'
    : null


  await booksApi.create({
  title: form.title,
  author: form.author,
  status: form.status,
  my_rating: Number(form.my_rating),
  number_of_pages: Number(form.number_of_pages) || 0,
  review: form.review,
  read_at: readAt,
  published_at: form.published_at 
  ? `${form.published_at}-01-01T00:00:00.000Z` 
  : null,
})
      setSuccess(true)
      setTimeout(() => navigate('/library'), 1200)
    } catch (e) {
      setError('Could not add book. Please try again.')
    }
    setLoading(false)
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', color: colors.warmOak, marginBottom: '8px' }}>
        Book added successfully!
      </div>
      <div style={{ fontSize: '13px', color: '#9c7a52' }}>Redirecting to your library...</div>
    </div>
  )

  return (
    <div style={{ background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '12px', padding: '2rem' }}>

      <ErrorBanner message={error} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField label="Title *">
          <input style={inputStyle} placeholder="Book title" value={form.title} onChange={set('title')} />
        </FormField>
        <FormField label="Author *">
          <input style={inputStyle} placeholder="Author name" value={form.author} onChange={set('author')} />
        </FormField>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <FormField label="Status">
          <select style={{ ...inputStyle, appearance: 'none' }} value={form.status} onChange={set('status')}>
            <option value="to-read">To Read</option>
            <option value="currently-reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </FormField>
        <FormField label="My Rating (0–5)">
  <input
    style={{
      ...inputStyle,
      opacity: form.status !== 'read' ? 0.4 : 1,
      cursor: form.status !== 'read' ? 'not-allowed' : 'text',
    }}
    type="number"
    min="0" max="5"
    placeholder={form.status !== 'read' ? 'Finish the book first' : '0'}
    value={form.status !== 'read' ? '' : form.my_rating}
    disabled={form.status !== 'read'}
    onChange={set('my_rating')}
  />
</FormField>
        <FormField label="Number of Pages">
          <input style={inputStyle} type="number" min="0" placeholder="optional" value={form.number_of_pages} onChange={set('number_of_pages')} />
        </FormField>
      </div>

      <FormField label="Published year (optional)">
        <input style={inputStyle} type="number" min="1000" max="2100" placeholder="ex. 2021" value={form.published_at} onChange={set('published_at')} />
      </FormField>

      <FormField label="Review">
        <textarea
          style={{ ...inputStyle, resize: 'none' }}
          rows={4}
          placeholder="Your thoughts on this book... (optional)"
          value={form.review}
          onChange={set('review')}
        />
      </FormField>

      {form.status === 'read' && (
        <FormField label="Date read">
          <input style={inputStyle} type="date" value={form.read_at} onChange={set('read_at')} />
        </FormField>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={() => navigate('/library')}
          style={{ background: 'transparent', color: '#9c7a52', border: `1px solid ${colors.linen}`, borderRadius: '8px', padding: '12px 20px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer' }}
        >Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: colors.warmOak, color: colors.cream, border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Adding...' : 'Add to library'}
        </button>
      </div>
    </div>
  )
}

function CsvTab({ onLogout }) {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (f && f.name.endsWith('.csv')) {
      setFile(f)
      setError('')
    } else {
      setError('Please upload a valid .csv file.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first.'); return }
    setLoading(true)
    setError('')
    try {
      await booksApi.upload(file)
      setSuccess(true)
      setTimeout(() => navigate('/library'), 1500)
    } catch (e) {
      setError('Could not upload file. Please try again.')
    }
    setLoading(false)
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', color: colors.warmOak, marginBottom: '8px' }}>
        Books imported successfully!
      </div>
      <div style={{ fontSize: '13px', color: '#9c7a52' }}>Redirecting to your library...</div>
    </div>
  )

  return (
    <div style={{ background: colors.cream, border: `1px solid ${colors.linen}`, borderRadius: '12px', padding: '2rem' }}>

      <ErrorBanner message={error} />

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csv-input').click()}
        style={{
          border: `2px dashed ${dragging ? colors.warmOak : colors.linen}`,
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          background: dragging ? '#f5ede0' : colors.parchment,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.warmOak} strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '16px', color: colors.ink, marginBottom: '6px' }}>
          {file ? file.name : 'Drop your CSV file here'}
        </div>
        <div style={{ fontSize: '12px', color: '#9c7a52', lineHeight: 1.6 }}>
          {file
            ? `${(file.size / 1024).toFixed(1)} KB · Ready to import`
            : 'or click to browse · Supports Goodreads CSV export'}
        </div>
      </div>

      {/* Info */}
      <div style={{ background: '#f0f4f0', border: `1px solid ${colors.sage}`, borderRadius: '8px', padding: '12px 16px', marginTop: '1.2rem', fontSize: '12px', color: colors.sage, lineHeight: 1.7 }}>
        <strong>How to export from Goodreads:</strong> Go to My Books → Import/Export → Export Library → Download the CSV file.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          onClick={() => navigate('/library')}
          style={{ background: 'transparent', color: '#9c7a52', border: `1px solid ${colors.linen}`, borderRadius: '8px', padding: '12px 20px', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: 'pointer' }}
        >Cancel</button>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{ background: file ? colors.blueberry : '#b0b8c4', color: colors.cream, border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", fontWeight: 700, cursor: file ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Importing...' : 'Import books'}
        </button>
      </div>
    </div>
  )
}

export default function AddBookPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('manual')

  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Lato', sans-serif" }}>
      <Navbar activePage="add-book" onLogout={onLogout} />

      <div style={{ padding: '2rem 2.5rem', maxWidth: '700px', margin: '0 auto' }}>

        <PageHeader
          title="Add a Book"
          subtitle="Add manually or import from a Goodreads CSV export"
        />

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1.5px solid ${colors.linen}`, marginBottom: '2rem' }}>
          {[
            { key: 'manual', label: 'Add manually' },
            { key: 'csv', label: 'Import from CSV' },
          ].map(tab => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '15px',
                paddingBottom: '12px',
                marginRight: '2rem',
                cursor: 'pointer',
                color: activeTab === tab.key ? colors.ink : '#b09070',
                borderBottom: activeTab === tab.key ? `2px solid ${colors.berry}` : '2px solid transparent',
                marginBottom: '-1.5px',
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {activeTab === 'manual'
          ? <ManualTab onLogout={onLogout} />
          : <CsvTab onLogout={onLogout} />
        }
      </div>
    </div>
  )
}
const BASE = ''

export const authApi = {
  login: async (email, password) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  register: async (name, email, password) => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  logout: async () => {
    const res = await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Logout failed')
  },
}

export const booksApi = {
  getAll: async () => {
    const res = await fetch(`${BASE}/books`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch books')
    return res.json()
  },

  create: async (book) => {
    const res = await fetch(`${BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(book),
    })
    if (!res.ok) throw new Error('Failed to create book')
  },

  delete: async (bookId) => {
    const res = await fetch(`${BASE}/books?book_id=${bookId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to delete book')
  },

  update: async (bookId, data) => {
    const res = await fetch(`${BASE}/books/update?book_id=${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update book')
  },

  upload: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${BASE}/books/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to upload CSV')
  },

  getStats: async () => {
  const res = await fetch(`${BASE}/books/stats`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
},

search: async (q) => {
  const res = await fetch(`${BASE}/books/search?q=${encodeURIComponent(q)}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to search books')
  return res.json()
},
}

export const recommendationsApi = {
  get: async () => {
    const res = await fetch(`${BASE}/recommendations`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to get recommendations')
    return res.json()
  },
}

export const profileApi = {
  updateName: async (name) => {
    const res = await fetch(`${BASE}/profile/name`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    })
    if (!res.ok) throw new Error(await res.text())
  },

  getProfile: async () => {
    const res = await fetch(`${BASE}/profile/me`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch profile')
    return res.json()
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${BASE}/profile/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })
    if (!res.ok) throw new Error(await res.text())
  },
}

import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LibraryPage from './pages/LibraryPage'
import AddBookPage from './pages/AddBookPage'
import RecommendationsPage from './pages/RecommendationsPage'
import DashboardPage from './pages/DashboardPage'
import StatisticsPage from './pages/StatisticsPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  )

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
        />

        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route
          path="/library"
          element={isLoggedIn ? <LibraryPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route
          path="/add-book"
          element={isLoggedIn ? <AddBookPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route
          path="/recommendations"
          element={isLoggedIn ? <RecommendationsPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route
          path="/statistics"
          element={isLoggedIn ? <StatisticsPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
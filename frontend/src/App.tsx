import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import Templates from './pages/Templates'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          {/* Root route - always redirect to login first */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id?"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  )
}

export default App
// Demo change for CI pipeline
// Demo change for CI pipeline

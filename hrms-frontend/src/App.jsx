import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Payroll from './pages/Payroll'
import Leaves from './pages/Leaves'
import Login from './pages/Login'
import DebugAuth from './pages/DebugAuth'
import './index.css'

// Protected Route Component
const RequireAuth = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to dashboard if authorized but not for this specific route
    // Or show an unauthorized page
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/debug-auth" element={<DebugAuth />} />

          <Route path="/" element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }>
            <Route index element={<Dashboard />} />

            <Route path="employees" element={
              <RequireAuth allowedRoles={['admin', 'hr']}>
                <Employees />
              </RequireAuth>
            } />

            <Route path="payroll" element={<Payroll />} />

            <Route path="leaves" element={<Leaves />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

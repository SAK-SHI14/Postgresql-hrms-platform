import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
  const location = useLocation() // Import useLocation via 'react-router-dom' if not already? It's imported in file? No, need to check imports.

  console.log('RequireAuth Check:', {
    path: window.location.pathname,
    loading,
    user: user ? user.email : 'null',
    role
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    console.log('RequireAuth: No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    console.log('RequireAuth: Role not allowed', role)
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

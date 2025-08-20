import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import CompaniesPage from './pages/CompaniesPage'
import AddCompanyPage from './pages/AddCompanyPage'
import EditCompanyPage from './pages/EditCompanyPage'
import BulkUploadPage from './pages/BulkUploadPage'
import UserManagementPage from './pages/UserManagementPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<CompaniesPage />} />
          <Route path="add" element={
            <ProtectedRoute requirePermission="canCreateCompanies">
              <AddCompanyPage />
            </ProtectedRoute>
          } />
          <Route path="edit/:id" element={
            <ProtectedRoute requirePermission="canEditCompanies">
              <EditCompanyPage />
            </ProtectedRoute>
          } />
          <Route path="bulk-upload" element={
            <ProtectedRoute requirePermission="canBulkUpload">
              <BulkUploadPage />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute requireRole="super_admin">
              <UserManagementPage />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <ProtectedRoute requirePermission="canViewAnalytics">
              <AnalyticsPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

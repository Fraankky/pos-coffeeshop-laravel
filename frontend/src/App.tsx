import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { ToastProvider } from '@/components/Toast';
import { LoginPage } from '@/pages/LoginPage';
import { StaffPage } from '@/pages/StaffPage';
import { QueuePage } from '@/pages/QueuePage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminMenuPage } from '@/pages/AdminMenuPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminTransactionsPage } from '@/pages/AdminTransactionsPage';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute roles={['staff', 'admin']} />}>
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/staff/queue" element={<QueuePage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/menu" element={<AdminMenuPage />} />
              <Route path="/admin/staff" element={<AdminUsersPage />} />
              <Route path="/admin/history" element={<AdminTransactionsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

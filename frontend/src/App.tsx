import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { KasirPage } from '@/pages/KasirPage';
import { BaristaPage } from '@/pages/BaristaPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminMenuPage } from '@/pages/AdminMenuPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminTablesPage } from '@/pages/AdminTablesPage';
import { AdminTransactionsPage } from '@/pages/AdminTransactionsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/kasir" element={<KasirPage />} />
            <Route path="/barista" element={<BaristaPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/menu" element={<AdminMenuPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/tables" element={<AdminTablesPage />} />
            <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

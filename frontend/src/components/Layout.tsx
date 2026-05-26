import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'kasir' ? 'Kasir' : 'Barista';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
        <div className="text-lg font-bold text-amber-800">POS Coffee</div>
        <div className="text-sm text-gray-500">Logged in as: {user?.name} ({roleLabel})</div>
        <nav className="flex flex-col gap-2 mt-4">
          {user?.role === 'kasir' && (
            <Link to="/kasir" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
              Kasir
            </Link>
          )}
          {user?.role === 'barista' && (
            <Link to="/barista" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
              Orders
            </Link>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
                Dashboard
              </Link>
              <Link to="/admin/menu" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
                Menu
              </Link>
              <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
                Users
              </Link>
              <Link to="/admin/tables" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
                Tables
              </Link>
              <Link to="/admin/transactions" className="px-3 py-2 rounded hover:bg-amber-50 text-gray-700 hover:text-amber-800">
                Transactions
              </Link>
            </>
          )}
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

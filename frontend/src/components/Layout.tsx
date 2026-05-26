import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const navItems = {
  kasir: [
    { to: '/kasir', label: 'Kasir', icon: '🛒' },
  ],
  barista: [
    { to: '/barista', label: 'Orders', icon: '📋' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/menu', label: 'Menu', icon: '☕' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/tables', label: 'Tables', icon: '🪑' },
    { to: '/admin/transactions', label: 'Transactions', icon: '🧾' },
  ],
} as const;

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleKey = user?.role ?? 'kasir';
  const items = navItems[roleKey as keyof typeof navItems] ?? [];
  const roleLabel = roleKey === 'admin' ? 'Admin' : roleKey === 'kasir' ? 'Kasir' : 'Barista';

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-roast flex flex-col flex-shrink-0">
        <div className="px-5 pt-5 pb-4 border-b border-mocha/40">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="text-xl font-extrabold text-cream tracking-tight">POS Coffee</span>
          </Link>
        </div>

        <div className="px-5 py-3 text-xs text-cream/50 border-b border-mocha/20">
          {user?.name} · <span className="capitalize">{roleLabel}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-latte text-foam shadow-lg shadow-black/20'
                    : 'text-cream/60 hover:text-cream hover:bg-espresso'}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-mocha/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/50 hover:text-cream hover:bg-espresso transition-all duration-150"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto bg-[#12100c]">
        <Outlet />
      </main>
    </div>
  );
}

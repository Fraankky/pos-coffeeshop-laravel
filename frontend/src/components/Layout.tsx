import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/staff', label: 'Staff' },
  { to: '/admin/history', label: 'History' },
] as const;

export function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 flex flex-col flex-shrink-0 border-r bg-sidebar text-sidebar-foreground">
        <div className="px-4 pt-5 pb-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight text-foreground">Flo Coffee</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Roastery</p>
        </div>

        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground">
            {user?.name} <span className="opacity-60">· Admin</span>
          </p>
        </div>

        <Separator className="mb-3" />

        <nav className="flex-1 px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Button
                key={item.to}
                variant={isActive ? 'secondary' : 'ghost'}
                size="default"
                className="w-full justify-start font-normal"
                render={
                  <Link to={item.to}>
                    {item.label}
                  </Link>
                }
              />
            );
          })}
        </nav>

        <Separator className="mt-auto" />
        <div className="px-2 py-3">
          <Button
            variant="ghost"
            size="default"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}

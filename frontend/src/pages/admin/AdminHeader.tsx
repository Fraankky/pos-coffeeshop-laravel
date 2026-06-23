import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function AdminHeader() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/admin/transactions?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="px-8 py-4 flex items-center justify-between border-b border-cream-dark/30 bg-white/30 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-bronze rounded-lg flex items-center justify-center shadow-sm">
          <i className="fas fa-leaf text-white text-sm" />
        </div>
        <div>
          <h1 className="font-bold text-espresso text-sm leading-tight tracking-tight">Flo Coffee Roastery</h1>
          <p className="text-[10px] text-gray-400 -mt-0.5">Coffee · Roastery</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari transaksi, menu..."
            className="w-full bg-white rounded-full py-2.5 pl-12 pr-12 text-sm border border-cream-dark/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-bronze/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 transition"
            >
              <i className="fas fa-times text-xs" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white rounded-full transition-all hover:shadow-sm">
          <i className="fas fa-bell text-gray-500" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] rounded-full flex items-center justify-center font-bold">0</span>
        </button>
        <div className="flex items-center gap-3 bg-white rounded-full pl-1 pr-4 py-1 shadow-sm border border-cream-dark/30">
          <img src={`https://i.pravatar.cc/150?u=${user?.id || 1}`} alt="" className="w-8 h-8 rounded-full" />
          <div className="text-sm hidden sm:block">
            <p className="font-semibold text-gray-700 text-xs leading-tight">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

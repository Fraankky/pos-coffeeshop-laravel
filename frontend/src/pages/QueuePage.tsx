import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { usePolling } from '@/hooks/usePolling';
import type { Order } from '@/types';

type FilterStatus = 'all' | 'received' | 'in_progress';

export function QueuePage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const fetchActiveOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/active');
      setOrders(data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  usePolling(fetchActiveOrders);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchActiveOrders();
    } catch { /* silent */ }
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}j ${mins % 60}m`;
  };

  const getAgeMins = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    return diff / 60000;
  };

  const getAgeStyle = (date: string) => {
    const mins = getAgeMins(date);
    if (mins < 5) return 'border-l-green-500 bg-green-50/30';
    if (mins < 10) return 'border-l-yellow-500 bg-yellow-50/30';
    return 'border-l-red-500 bg-red-50/30';
  };

  const getAgeBadge = (date: string) => {
    const mins = getAgeMins(date);
    if (mins < 5) return 'bg-green-50 text-green-600';
    if (mins < 10) return 'bg-yellow-50 text-yellow-600';
    return 'bg-red-50 text-red-500';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const receivedCount = orders.filter((o) => o.status === 'received').length;
  const inProgressCount = orders.filter((o) => o.status === 'in_progress').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-bronze/30 border-t-bronze rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat antrian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b border-cream-dark/50 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bronze rounded-lg flex items-center justify-center shadow-sm">
              <i className="fas fa-leaf text-white text-sm" />
            </div>
            <div>
              <h1 className="font-bold text-espresso text-sm leading-tight tracking-tight">Flo Coffee Roastery</h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">Coffee · Roastery</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              to="/staff"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                location.pathname === '/staff'
                  ? 'bg-bronze text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              POS
            </Link>
            <Link
              to="/staff/queue"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                location.pathname === '/staff/queue'
                  ? 'bg-bronze text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Queue
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <div className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 shadow-sm border border-cream-dark/30">
            <img
              src={`https://i.pravatar.cc/150?u=${user?.id || 5}`}
              alt=""
              className="w-7 h-7 rounded-full"
            />
            <div className="text-sm hidden sm:block">
              <p className="font-semibold text-gray-700 text-xs leading-tight">{user?.name || 'Staff'}</p>
              <p className="text-[10px] text-gray-400">Staff</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-espresso tracking-tight">Barista Queue</h1>
            <p className="text-sm text-gray-400 mt-1">
              Proses pesanan yang masuk secara real-time
            </p>
          </div>
          <span className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-cream-dark/30">
            Auto-refresh 5dtk {orders.length > 0 ? `· ${orders.length} pesanan` : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {([
            { status: 'all' as FilterStatus, label: 'Semua', count: orders.length },
            { status: 'received' as FilterStatus, label: 'Baru', count: receivedCount },
            { status: 'in_progress' as FilterStatus, label: 'Diproses', count: inProgressCount },
          ]).map((tab) => (
            <button
              key={tab.status}
              onClick={() => setFilter(tab.status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.status
                  ? 'bg-bronze text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${
                filter === tab.status ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4">
              {orders.length === 0 ? '☕' : '🔍'}
            </span>
            <p className="text-lg text-gray-500 font-medium">
              {orders.length === 0 ? 'Belum ada pesanan' : 'Tidak ada pesanan dengan filter ini'}
            </p>
            <p className="text-sm mt-1">
              {orders.length === 0 ? 'Tunggu pesanan baru dari POS staff' : 'Coba ubah filter status'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border-l-4 p-4 shadow-sm border border-cream-dark/30 card-hover transition-all ${getAgeStyle(order.created_at)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono font-medium">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'received'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {order.status === 'received' ? 'Baru' : 'Diproses'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAgeBadge(order.created_at)}`}>
                    {getTimeAgo(order.created_at)}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  {order.order_items?.map((item, i) => (
                    <div key={i} className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {item.menu_item?.name}
                        <span className="text-gray-400 ml-1">x{item.quantity}</span>
                        {item.size && item.size !== 'regular' && (
                          <span className="text-xs text-gray-400 ml-1 capitalize">({item.size})</span>
                        )}
                      </span>
                    </div>
                  ))}
                  {order.order_items?.some((i) => i.customization_notes) && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      {order.order_items
                        ?.filter((i) => i.customization_notes)
                        .map((item, i) => (
                          <p key={i} className="text-xs text-gray-400 italic">
                            {item.menu_item?.name}: {item.customization_notes}
                          </p>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
                  <span className={`flex items-center gap-1.5 ${
                    order.order_type === 'dine_in' ? 'text-blue-500' : 'text-green-600'
                  }`}>
                    {order.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}
                    {order.order_type === 'dine_in' && ` · Meja ${order.table?.table_number ?? '-'}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  {order.status === 'received' && (
                    <button
                      onClick={() => updateStatus(order.id, 'in_progress')}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-bronze text-white text-sm font-medium hover:bg-bronze-dark transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      Proses
                    </button>
                  )}
                  {order.status === 'in_progress' && (
                    <>
                      <button
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        Selesai
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-all active:scale-95"
                      >
                        Batal
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

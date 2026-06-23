import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { usePolling } from '@/hooks/usePolling';
import type { Order } from '@/types';

type FilterStatus = 'all' | 'received' | 'in_progress';

export function QueuePage() {
  const { user } = useAuthStore();
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

  const getAgeColor = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = diff / 60000;
    if (mins < 5) return 'border-l-green-500';
    if (mins < 10) return 'border-l-yellow-500';
    return 'border-l-red-500';
  };

  const getAgeBg = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = diff / 60000;
    if (mins < 5) return 'bg-green-500/10 text-green-400';
    if (mins < 10) return 'bg-yellow-500/10 text-yellow-400';
    return 'bg-red-500/10 text-red-400';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const receivedCount = orders.filter((o) => o.status === 'received').length;
  const inProgressCount = orders.filter((o) => o.status === 'in_progress').length;

  const FilterTab = ({ status, label, count }: { status: FilterStatus; label: string; count?: number }) => (
    <button
      onClick={() => setFilter(status)}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        filter === status
          ? 'bg-caramen text-white shadow-lg shadow-caramen/20'
          : 'text-cream/50 hover:text-cream hover:bg-espresso'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${
          filter === status ? 'bg-white/20' : 'bg-mocha/40'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#12100c] flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b border-mocha/40 bg-roast/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="text-lg font-extrabold text-cream tracking-tight">Flo Coffee</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/staff"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-cream/50 hover:text-cream hover:bg-espresso transition-all"
            >
              POS
            </Link>
            <Link
              to="/staff/queue"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-latte text-foam shadow-lg"
            >
              Queue
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-cream/40 hidden md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <div className="flex items-center gap-2 bg-mocha/30 rounded-full pl-1 pr-3 py-1 border border-mocha/30">
            <img
              src={`https://i.pravatar.cc/150?u=${user?.id || 5}`}
              alt=""
              className="w-7 h-7 rounded-full"
            />
            <span className="text-xs text-cream/60 hidden sm:block">{user?.name || 'Staff'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foam tracking-tight">Barista Queue</h1>
            <p className="text-sm text-cream/40 mt-1">
              Proses pesanan yang masuk secara real-time
            </p>
          </div>
          <span className="text-xs text-cream/30 bg-mocha/20 px-3 py-1.5 rounded-full">
            Auto-refresh 5dtk {orders.length > 0 ? `· ${orders.length} pesanan` : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <FilterTab status="all" label="Semua" count={orders.length} />
          <FilterTab status="received" label="Baru" count={receivedCount} />
          <FilterTab status="in_progress" label="Diproses" count={inProgressCount} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-caramen/30 border-t-caramen rounded-full animate-spin mb-4" />
            <p className="text-cream/40 text-sm">Memuat antrian...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-cream/30">
            <span className="text-6xl mb-4">☕</span>
            <p className="text-lg text-cream/50 font-medium">
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
                className={`bg-espresso rounded-2xl border-l-4 border-mocha/30 p-4 shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 ${getAgeColor(order.created_at)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cream/50 font-mono font-medium">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'received'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status === 'received' ? 'Baru' : 'Diproses'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAgeBg(order.created_at)}`}>
                    {getTimeAgo(order.created_at)}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  {order.order_items?.map((item, i) => (
                    <div key={i} className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-milk">
                        {item.menu_item?.name}
                        <span className="text-cream/40 ml-1">x{item.quantity}</span>
                        {item.size && item.size !== 'regular' && (
                          <span className="text-xs text-cream/30 ml-1 capitalize">({item.size})</span>
                        )}
                      </span>
                    </div>
                  ))}
                  {order.order_items?.some((i) => i.customization_notes) && (
                    <div className="mt-2 pt-2 border-t border-mocha/20">
                      {order.order_items
                        ?.filter((i) => i.customization_notes)
                        .map((item, i) => (
                          <p key={i} className="text-xs text-cream/40 italic">
                            📝 {item.menu_item?.name}: {item.customization_notes}
                          </p>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-cream/50 mb-4 pb-3 border-b border-mocha/10">
                  <span className={`flex items-center gap-1.5 ${
                    order.order_type === 'dine_in' ? 'text-blue-400/70' : 'text-green-400/70'
                  }`}>
                    <span>{order.order_type === 'dine_in' ? '🍽️' : '🛍️'}</span>
                    {order.order_type === 'dine_in' ? `Meja ${order.table?.table_number ?? '-'}` : 'Takeaway'}
                  </span>
                </div>

                <div className="flex gap-2">
                  {order.status === 'received' && (
                    <button
                      onClick={() => updateStatus(order.id, 'in_progress')}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-caramen text-white text-sm font-medium hover:bg-caramen-hover transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>☕</span> Proses
                    </button>
                  )}
                  {order.status === 'in_progress' && (
                    <>
                      <button
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>✅</span> Selesai
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all active:scale-95"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

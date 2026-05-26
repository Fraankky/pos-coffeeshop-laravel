import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { usePolling } from '@/hooks/usePolling';
import type { Order } from '@/types';

export function BaristaPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/active');
      setOrders(data.data);
      setLoading(false);
    } catch { /* silent */ }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-cream/40">Memuat antrian...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foam tracking-tight">Barista Queue</h1>
        <span className="text-sm text-cream/50">
          {orders.length} pesanan · auto-refresh 5dtk
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-cream/40">
          <span className="text-5xl mb-4">✅</span>
          <p className="text-lg text-foam font-medium">Semua pesanan selesai</p>
          <p className="text-sm">Tunggu pesanan baru dari kasir</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-espresso rounded-2xl border-l-4 border-mocha/30 p-4 shadow-lg shadow-black/20 ${getAgeColor(order.created_at)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cream/50 font-medium">#{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${order.status === 'received' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {order.status === 'received' ? 'Baru' : 'Diproses'}
                  </span>
                </div>
                <span className="text-xs text-cream/40">{getTimeAgo(order.created_at)}</span>
              </div>

              <div className="space-y-1 mb-4">
                {order.order_items?.map((item, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-milk">{item.menu_item?.name}</span>
                    <span className="text-cream/50"> x{item.quantity}</span>
                    {item.customization_notes && (
                      <p className="text-xs text-cream/30 italic ml-2">Note: {item.customization_notes}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-cream/50 mb-4">
                <span>{order.order_type === 'dine_in' ? `Meja ${order.table?.table_number ?? '-'}` : 'Takeaway'}</span>
              </div>

              <div className="flex gap-2">
                {order.status === 'received' && (
                  <button
                    onClick={() => updateStatus(order.id, 'in_progress')}
                    className="flex-1 px-3 py-2 rounded-xl bg-caramen text-white text-sm font-medium hover:bg-caramen-hover transition-all active:scale-95"
                  >
                    Proses
                  </button>
                )}
                {order.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="flex-1 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-all active:scale-95"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
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
  );
}

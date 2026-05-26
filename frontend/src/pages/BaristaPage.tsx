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
    } catch {
      // silent fail on polling
    }
  }, []);

  usePolling(fetchActiveOrders);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchActiveOrders();
    } catch {
      // silent fail
    }
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
    if (mins < 5) return 'border-green-400';
    if (mins < 10) return 'border-yellow-400';
    return 'border-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Memuat antrian...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Barista Queue</h1>
        <span className="text-sm text-gray-500">
          {orders.length} pesanan aktif · auto-refresh 5dtk
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-3">✅</span>
          <p className="text-lg">Semua pesanan selesai</p>
          <p className="text-sm">Tunggu pesanan baru dari kasir</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${getAgeColor(order.created_at)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs text-gray-500">Order #{order.id}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs text-white
                    ${order.status === 'received' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                    {order.status === 'received' ? 'Baru' : 'Diproses'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{getTimeAgo(order.created_at)}</span>
              </div>

              <div className="space-y-1 mb-3">
                {order.order_items?.map((item, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{item.menu_item?.name}</span>
                    <span className="text-gray-400"> x{item.quantity}</span>
                    {item.customization_notes && (
                      <p className="text-xs text-gray-400 italic ml-2">Note: {item.customization_notes}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{order.order_type === 'dine_in' ? `Meja ${order.table?.table_number ?? '-'}` : 'Takeaway'}</span>
              </div>

              <div className="flex gap-2">
                {order.status === 'received' && (
                  <button
                    onClick={() => updateStatus(order.id, 'in_progress')}
                    className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Proses
                  </button>
                )}
                {order.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
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

import { useCallback } from 'react';
import api from '@/lib/api';
import { usePolling } from '@/hooks/usePolling';
import type { Order } from '@/types';

interface Props {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
}

function getTimeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}j ${mins % 60}m`;
}

export function QueuePanel({ orders, loading, onRefresh }: Props) {
  const updateStatus = useCallback(async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      onRefresh();
    } catch {
      // error handled by parent
    }
  }, [onRefresh]);

  usePolling(onRefresh);

  const activeOrders = orders.filter((o) => o.status === 'received' || o.status === 'in_progress');

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-dark/30">
        <p className="text-xs text-gray-400 animate-pulse">Memuat antrian...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-dark/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <i className="fas fa-list-check text-bronze" />
          Antrian
        </h3>
        <span className="text-xs text-gray-400">{activeOrders.length} pesanan</span>
      </div>

      {activeOrders.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          Tidak ada antrian. Buat order baru untuk memulai.
        </p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto receipt-scroll">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className={`flex items-center gap-3 p-3 rounded-xl border-l-3 transition-all
                ${order.status === 'received' ? 'border-l-blue-500 bg-blue-50/30' : 'border-l-amber-500 bg-amber-50/30'}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bronze/10 flex items-center justify-center text-bronze text-xs font-bold">
                #{order.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{getTimeAgo(order.created_at)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                    ${order.status === 'received' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.status === 'received' ? 'Baru' : 'Diproses'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium truncate">
                  {order.order_items?.map((i) => i.menu_item?.name).join(', ') || `Order #${order.id}`}
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-1">
                {order.status === 'received' && (
                  <button
                    onClick={() => updateStatus(order.id, 'in_progress')}
                    className="px-3 py-1.5 bg-bronze text-white text-xs font-medium rounded-lg hover:bg-bronze-dark transition-all active:scale-95"
                  >
                    Proses
                  </button>
                )}
                {order.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-500 transition-all active:scale-95"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="px-2 py-1.5 bg-red-100 text-red-500 text-xs font-medium rounded-lg hover:bg-red-200 transition-all"
                    >
                      <i className="fas fa-times" />
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

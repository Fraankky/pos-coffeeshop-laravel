import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Order } from '@/types';

export function RecentTransactions() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/active');
      setOrders(data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecent(); }, [fetchRecent]);

  const statusClasses: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-400',
    in_progress: 'bg-amber-500/10 text-amber-400',
    received: 'bg-blue-500/10 text-blue-400',
    cancelled: 'bg-red-500/10 text-red-400',
  };

  if (loading) return (
    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-400 animate-pulse">Memuat transaksi...</p>
    </div>
  );

  return (
    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-exchange-alt text-bronze" />
          <h3 className="font-semibold text-gray-800">Transaksi Aktif</h3>
        </div>
        <button onClick={fetchRecent} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <i className="fas fa-redo text-gray-400 text-xs" />
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Belum ada transaksi aktif</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400">
              <th className="pb-3 font-medium">#</th>
              <th className="pb-3 font-medium">Tipe</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.slice(0, 8).map((order) => (
              <tr key={order.id} className="border-t border-gray-50">
                <td className="py-3">
                  <span className="font-medium text-gray-800">#{order.id}</span>
                </td>
                <td className="py-3 text-gray-500 capitalize">{order.order_type === 'dine_in' ? 'Dine-in' : 'Takeaway'}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses[order.status] || ''}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {order.order_items?.slice(0, 2).map((i) => i.menu_item?.name).join(', ') || '-'}
                  {(order.order_items?.length || 0) > 2 && '...'}
                </td>
                <td className="py-3 text-right font-semibold text-gray-800">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

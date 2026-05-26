import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Order } from '@/types';

export function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchOrders = useCallback(async () => {
    const { data } = await api.get('/orders', {
      params: { per_page: 50, date_from: from, date_to: to },
    });
    setOrders(data.data.data ?? data.data);
  }, [from, to]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const viewDetail = async (id: number) => {
    const { data } = await api.get(`/orders/${id}`);
    setSelected(data.data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tanggal</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kasir</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Tipe</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">#{order.id}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3">{order.user?.name ?? '-'}</td>
                <td className="px-4 py-3 text-center capitalize">{order.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs capitalize
                    ${order.status === 'completed' ? 'bg-green-100 text-green-700'
                      : order.status === 'cancelled' ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">Rp {order.total_amount.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => viewDetail(order.id)} className="text-blue-600 hover:text-blue-800 text-xs">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">Belum ada transaksi</p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Order #{selected.id}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span>{new Date(selected.created_at).toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kasir</span><span>{selected.user?.name ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tipe</span><span className="capitalize">{selected.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}</span></div>
              {selected.table && <div className="flex justify-between"><span className="text-gray-500">Meja</span><span>{selected.table.table_number}</span></div>}
              <hr />
              <p className="font-medium">Items</p>
              {selected.order_items?.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{item.menu_item?.name} x{item.quantity}</span>
                  <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between font-bold"><span>Total</span><span className="text-amber-700">Rp {selected.total_amount.toLocaleString('id-ID')}</span></div>
              {selected.payment && (
                <>
                  <div className="flex justify-between text-xs"><span>Metode</span><span className="capitalize">{selected.payment.method === 'cash' ? 'Tunai' : 'QRIS'}</span></div>
                  <div className="flex justify-between text-xs"><span>Bayar</span><span>Rp {selected.payment.amount_paid.toLocaleString('id-ID')}</span></div>
                  {selected.payment.change_amount > 0 && (
                    <div className="flex justify-between text-xs"><span>Kembali</span><span>Rp {selected.payment.change_amount.toLocaleString('id-ID')}</span></div>
                  )}
                </>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded text-sm">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

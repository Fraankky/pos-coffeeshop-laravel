import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Order } from '@/types';

export function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchOrders = useCallback(async () => {
    const { data } = await api.get('/orders', { params: { per_page: 50 } });
    setOrders(data.data.data ?? data.data);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const viewDetail = async (id: number) => {
    const { data } = await api.get(`/orders/${id}`);
    setSelected(data.data);
  };

  const statusClasses: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400',
    pending: 'bg-yellow-500/10 text-yellow-400',
    received: 'bg-blue-500/10 text-blue-400',
    in_progress: 'bg-yellow-500/10 text-yellow-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foam tracking-tight">Transaction History</h1>
        <div className="flex items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-1.5 text-sm text-milk focus:outline-none focus:ring-2 focus:ring-caramen" />
          <span className="text-cream/40">-</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-1.5 text-sm text-milk focus:outline-none focus:ring-2 focus:ring-caramen" />
        </div>
      </div>

      <div className="bg-espresso rounded-2xl border border-mocha/30 overflow-hidden shadow-lg shadow-black/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mocha/30">
              <th className="text-left px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Tanggal</th>
              <th className="text-left px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Staff</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Tipe</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Total</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/20">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-vanilla/5 transition-colors">
                <td className="px-4 py-3 font-medium text-milk">#{order.id}</td>
                <td className="px-4 py-3 text-cream/60">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3 text-milk">{order.user?.name ?? '-'}</td>
                <td className="px-4 py-3 text-center capitalize text-cream/60">{order.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusClasses[order.status] || ''}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-cream">Rp {order.total_amount.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => viewDetail(order.id)} className="text-cream/60 hover:text-caramen text-xs transition-colors">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-8 text-cream/40 text-sm">Belum ada transaksi</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-espresso border border-mocha/40 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foam mb-4">Order #{selected.id}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-cream/60">Tanggal</span><span className="text-milk">{new Date(selected.created_at).toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between"><span className="text-cream/60">Staff</span><span className="text-milk">{selected.user?.name ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-cream/60">Tipe</span><span className="text-milk capitalize">{selected.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}</span></div>
              {selected.table && <div className="flex justify-between"><span className="text-cream/60">Meja</span><span className="text-milk">{selected.table.table_number}</span></div>}
              <hr className="border-mocha/30 my-2" />
              <p className="font-medium text-foam">Items</p>
              {selected.order_items?.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-milk">{item.menu_item?.name} x{item.quantity}</span>
                  <span className="text-cream">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
              <hr className="border-mocha/30 my-2" />
              <div className="flex justify-between font-bold"><span className="text-foam">Total</span><span className="text-caramen">Rp {selected.total_amount.toLocaleString('id-ID')}</span></div>
              {selected.payment && (
                <div className="text-xs text-cream/60 space-y-1 mt-2">
                  <div className="flex justify-between"><span>Metode</span><span className="capitalize">{selected.payment.method === 'cash' ? 'Tunai' : 'QRIS'}</span></div>
                  <div className="flex justify-between"><span>Bayar</span><span>Rp {selected.payment.amount_paid.toLocaleString('id-ID')}</span></div>
                  {selected.payment.change_amount > 0 && <div className="flex justify-between"><span>Kembali</span><span>Rp {selected.payment.change_amount.toLocaleString('id-ID')}</span></div>}
                </div>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-4 px-4 py-2.5 rounded-xl border border-mocha/30 text-cream/60 hover:text-cream transition-all text-sm font-medium">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

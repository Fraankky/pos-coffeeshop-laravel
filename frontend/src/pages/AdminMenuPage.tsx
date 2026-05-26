import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Category, MenuItem } from '@/types';

export function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: '', category_id: 0, price: 0, stock_qty: 0, stock_min_threshold: 5, is_available: true });

  const fetchData = useCallback(async () => {
    const [itemsRes, catRes] = await Promise.all([
      api.get('/menu-items', { params: { per_page: 100 } }),
      api.get('/categories'),
    ]);
    setItems(itemsRes.data.data.data);
    setCategories(catRes.data.data);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setForm({ name: '', category_id: categories[0]?.id || 0, price: 0, stock_qty: 0, stock_min_threshold: 5, is_available: true });
    setEditing(null); setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, category_id: item.category_id, price: item.price, stock_qty: item.stock_qty, stock_min_threshold: item.stock_min_threshold, is_available: item.is_available });
    setEditing(item); setShowForm(true);
  };

  const handleSave = async () => {
    if (editing) await api.put(`/menu-items/${editing.id}`, form);
    else await api.post('/menu-items', form);
    setShowForm(false); fetchData();
  };

  const toggleAvailable = async (item: MenuItem) => {
    await api.put(`/menu-items/${item.id}`, { is_available: !item.is_available });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus item ini?')) { await api.delete(`/menu-items/${id}`); fetchData(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foam tracking-tight">Menu Management</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-caramen text-white text-sm font-medium hover:bg-caramen-hover transition-all">
          + Tambah Menu
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-espresso border border-mocha/40 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foam mb-4">{editing ? 'Edit Menu' : 'Tambah Menu'}</h2>
            <div className="space-y-3">
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk focus:outline-none focus:ring-2 focus:ring-caramen">
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
              <input placeholder="Nama menu" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              <input type="number" placeholder="Harga" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              <div className="flex gap-2">
                <input type="number" placeholder="Stok" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
                  className="flex-1 bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
                <input type="number" placeholder="Min stok" value={form.stock_min_threshold} onChange={(e) => setForm({ ...form, stock_min_threshold: Number(e.target.value) })}
                  className="flex-1 bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-mocha/30 text-cream/60 hover:text-cream transition-all text-sm font-medium">Batal</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-xl bg-caramen text-white hover:bg-caramen-hover transition-all text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-espresso rounded-2xl border border-mocha/30 overflow-hidden shadow-lg shadow-black/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mocha/30">
              <th className="text-left px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Nama</th>
              <th className="text-left px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Kategori</th>
              <th className="text-right px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Harga</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Stok</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/20">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-vanilla/5 transition-colors">
                <td className="px-4 py-3 text-milk font-medium">{item.name}</td>
                <td className="px-4 py-3 text-cream/60">{categories.find((c) => c.id === item.category_id)?.name}</td>
                <td className="px-4 py-3 text-right text-cream">Rp {item.price.toLocaleString('id-ID')}</td>
                <td className={`px-4 py-3 text-center ${item.stock_qty <= item.stock_min_threshold && item.stock_qty > 0 ? 'text-red-400 font-medium' : 'text-milk'}`}>
                  {item.stock_qty}
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleAvailable(item)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                      ${item.is_available ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {item.is_available ? 'Tersedia' : 'Habis'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(item)} className="text-cream/60 hover:text-caramen text-xs mr-3 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center py-8 text-cream/40 text-sm">Belum ada menu</p>}
      </div>
    </div>
  );
}

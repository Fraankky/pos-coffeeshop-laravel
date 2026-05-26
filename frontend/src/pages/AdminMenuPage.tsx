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
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, category_id: item.category_id, price: item.price, stock_qty: item.stock_qty, stock_min_threshold: item.stock_min_threshold, is_available: item.is_available });
    setEditing(item);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (editing) {
      await api.put(`/menu-items/${editing.id}`, form);
    } else {
      await api.post('/menu-items', form);
    }
    setShowForm(false);
    fetchData();
  };

  const toggleAvailable = async (item: MenuItem) => {
    await api.put(`/menu-items/${item.id}`, { is_available: !item.is_available });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus item ini?')) {
      await api.delete(`/menu-items/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm hover:bg-amber-800">
          + Tambah Menu
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Menu' : 'Tambah Menu'}</h2>
            <div className="space-y-3">
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                placeholder="Nama menu"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Harga"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Stok"
                  value={form.stock_qty}
                  onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Min stok"
                  value={form.stock_min_threshold}
                  onChange={(e) => setForm({ ...form, stock_min_threshold: Number(e.target.value) })}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm">Batal</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-amber-700 text-white rounded text-sm hover:bg-amber-800">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Harga</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Stok</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3 text-gray-500">{categories.find((c) => c.id === item.category_id)?.name}</td>
                <td className="px-4 py-3 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                <td className={`px-4 py-3 text-center ${item.stock_qty <= item.stock_min_threshold && item.stock_qty > 0 ? 'text-red-500 font-medium' : ''}`}>
                  {item.stock_qty}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`px-2 py-0.5 rounded text-xs ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {item.is_available ? 'Tersedia' : 'Habis'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs mr-2">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">Belum ada menu</p>
        )}
      </div>
    </div>
  );
}

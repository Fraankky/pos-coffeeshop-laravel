import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Table } from '@/types';

export function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Table | null>(null);
  const [form, setForm] = useState({ table_number: '', capacity: 4 });

  const fetchTables = useCallback(async () => {
    const { data } = await api.get('/tables');
    setTables(data.data);
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  const openCreate = () => {
    setForm({ table_number: String(tables.length + 1), capacity: 4 });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (table: Table) => {
    setForm({ table_number: table.table_number, capacity: table.capacity });
    setEditing(table);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (editing) {
      await api.put(`/tables/${editing.id}`, form);
    } else {
      await api.post('/tables', form);
    }
    setShowForm(false);
    fetchTables();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus meja ini?')) {
      await api.delete(`/tables/${id}`);
      fetchTables();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm hover:bg-amber-800">
          + Tambah Meja
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Meja' : 'Tambah Meja'}</h2>
            <div className="space-y-3">
              <input
                placeholder="Nomor meja"
                value={form.table_number}
                onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Kapasitas"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm">Batal</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-amber-700 text-white rounded text-sm hover:bg-amber-800">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tables.map((table) => (
          <div key={table.id} className={`bg-white rounded-lg shadow-sm border p-4 text-center ${table.status === 'occupied' ? 'opacity-60' : ''}`}>
            <div className="text-2xl font-bold text-amber-800">{table.table_number}</div>
            <div className="text-xs text-gray-500">{table.capacity} kursi</div>
            <div className={`text-xs mt-1 ${table.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>
              {table.status === 'available' ? 'Tersedia' : 'Terisi'}
            </div>
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={() => openEdit(table)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
              <button onClick={() => handleDelete(table.id)} className="text-xs text-red-600 hover:text-red-800">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

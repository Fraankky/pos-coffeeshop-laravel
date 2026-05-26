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

  const openCreate = () => { setForm({ table_number: String(tables.length + 1), capacity: 4 }); setEditing(null); setShowForm(true); };
  const openEdit = (table: Table) => { setForm({ table_number: table.table_number, capacity: table.capacity }); setEditing(table); setShowForm(true); };

  const handleSave = async () => {
    if (editing) await api.put(`/tables/${editing.id}`, form);
    else await api.post('/tables', form);
    setShowForm(false); fetchTables();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus meja ini?')) { await api.delete(`/tables/${id}`); fetchTables(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foam tracking-tight">Table Management</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-caramen text-white text-sm font-medium hover:bg-caramen-hover transition-all">
          + Tambah Meja
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-espresso border border-mocha/40 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foam mb-4">{editing ? 'Edit Meja' : 'Tambah Meja'}</h2>
            <div className="space-y-3">
              <input placeholder="Nomor meja" value={form.table_number} onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              <input type="number" placeholder="Kapasitas" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-mocha/30 text-cream/60 hover:text-cream transition-all text-sm font-medium">Batal</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-xl bg-caramen text-white hover:bg-caramen-hover transition-all text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tables.map((table) => (
          <div key={table.id} className={`bg-espresso rounded-2xl border p-4 text-center transition-all shadow-lg shadow-black/20
            ${table.status === 'occupied' ? 'border-red-500/20 opacity-70' : 'border-mocha/30 hover:border-cream/30'}`}>
            <div className="text-2xl font-extrabold text-caramen">{table.table_number}</div>
            <div className="text-xs text-cream/50 mt-1">{table.capacity} kursi</div>
            <div className={`text-xs mt-2 font-medium ${table.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>
              {table.status === 'available' ? 'Tersedia' : 'Terisi'}
            </div>
            <div className="flex gap-2 justify-center mt-3">
              <button onClick={() => openEdit(table)} className="text-xs text-cream/60 hover:text-caramen transition-colors">Edit</button>
              <button onClick={() => handleDelete(table.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

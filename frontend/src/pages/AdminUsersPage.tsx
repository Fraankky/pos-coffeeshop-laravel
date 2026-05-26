import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { User } from '@/types';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'kasir' });

  const fetchUsers = useCallback(async () => {
    const { data } = await api.get('/users');
    setUsers(data.data);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setForm({ name: '', email: '', password: '', role: 'kasir' }); setEditing(null); setShowForm(true); };
  const openEdit = (user: User) => { setForm({ name: user.name, email: user.email, password: '', role: user.role }); setEditing(user); setShowForm(true); };

  const handleSave = async () => {
    if (editing) {
      const payload = { ...form };
      if (!payload.password) delete (payload as any).password;
      await api.put(`/users/${editing.id}`, payload);
    } else await api.post('/users', form);
    setShowForm(false); fetchUsers();
  };

  const toggleActive = async (user: User) => {
    await api.patch(`/users/${user.id}/toggle`);
    fetchUsers();
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-400',
    barista: 'bg-blue-500/10 text-blue-400',
    kasir: 'bg-green-500/10 text-green-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foam tracking-tight">User Management</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-caramen text-white text-sm font-medium hover:bg-caramen-hover transition-all">
          + Tambah User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-espresso border border-mocha/40 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foam mb-4">{editing ? 'Edit User' : 'Tambah User'}</h2>
            <div className="space-y-3">
              <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              <input placeholder={editing ? 'Kosongkan jika tidak diganti' : 'Password'} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2.5 text-sm text-milk focus:outline-none focus:ring-2 focus:ring-caramen">
                <option value="kasir">Kasir</option>
                <option value="barista">Barista</option>
                <option value="admin">Admin</option>
              </select>
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
              <th className="text-left px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Email</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Role</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-4 py-3 font-medium text-cream/60 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/20">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-vanilla/5 transition-colors">
                <td className="px-4 py-3 text-milk font-medium">{user.name}</td>
                <td className="px-4 py-3 text-cream/60">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role] || ''}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(user)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                      ${user.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(user)} className="text-cream/60 hover:text-caramen text-xs transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

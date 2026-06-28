import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/Toast';

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ name: '', email: '', password: '', role: 'staff' });
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    const { data } = await api.get('/users');
    setUsers(data.data);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setForm({ name: '', email: '', password: '', role: 'staff' }); setEditing(null); setShowForm(true); };
  const openEdit = (user: User) => { setForm({ name: user.name, email: user.email, password: '', role: user.role }); setEditing(user); setShowForm(true); };

  const handleSave = async () => {
    if (editing) {
      const payload: Partial<UserForm> = { ...form };
      if (!payload.password) delete payload.password;
      await api.put(`/users/${editing.id}`, payload);
    } else await api.post('/users', form);
    setShowForm(false); fetchUsers();
  };

  const toggleActive = async (user: User) => {
    await api.patch(`/users/${user.id}/toggle`);
    fetchUsers();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      toast.show('Staff berhasil dihapus');
      fetchUsers();
    } catch {
      toast.show('Gagal menghapus. Anda tidak bisa menghapus diri sendiri.', 'error');
    }
  };

  const roleVariant = (role: string) => role === 'admin' ? 'default' as const : 'secondary' as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola akun staff dan admin</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Staff</Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Staff' : 'Tambah Staff'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{editing ? 'Password (kosongkan jika tidak diganti)' : 'Password'}</Label>
              <Input placeholder={editing ? 'Kosongkan jika tidak diganti' : 'Password'} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Staff</DialogTitle>
            <DialogDescription>
              Hapus staff "{deleteTarget?.name}" dari daftar pengguna?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={user.is_active ? 'default' : 'destructive'} onClick={() => toggleActive(user)} className="cursor-pointer">
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="link" size="sm" onClick={() => openEdit(user)}>Edit</Button>
                    <Button variant="link" size="sm" className="text-destructive" onClick={() => setDeleteTarget(user)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">Belum ada staff</p>}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Category, MenuItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/Toast';

export function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: '', category_id: 0, price: 0, image: '', stock_qty: 0, stock_min_threshold: 5, is_available: true });
  const toast = useToast();

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
    setForm({ name: '', category_id: categories[0]?.id || 0, price: 0, image: '', stock_qty: 0, stock_min_threshold: 5, is_available: true });
    setEditing(null); setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, category_id: item.category_id, price: Number(item.price), image: item.image || '', stock_qty: item.stock_qty, stock_min_threshold: item.stock_min_threshold, is_available: item.is_available });
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/menu-items/${deleteTarget.id}`);
      setDeleteTarget(null);
      toast.show('Menu berhasil dihapus');
      fetchData();
    } catch {
      toast.show('Gagal menghapus menu', 'error');
    }
  };

  const catIdToString = (category_id: number) => categories.find((c) => c.id === category_id)?.name ?? '-';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Menu Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola daftar menu dan kategori</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Menu</Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Menu' : 'Tambah Menu'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
              >
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input placeholder="Nama menu" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>URL Gambar</Label>
              <Input placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              {form.image && (
                <img src={form.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>
            <div className="space-y-2">
              <Label>Harga</Label>
              <Input type="number" placeholder="0" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Stok</Label>
                <Input type="number" placeholder="0" value={form.stock_qty || ''} onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Min Stok</Label>
                <Input type="number" placeholder="5" value={form.stock_min_threshold || ''} onChange={(e) => setForm({ ...form, stock_min_threshold: Number(e.target.value) })} />
              </div>
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
            <DialogTitle>Hapus Menu</DialogTitle>
            <DialogDescription>
              Hapus menu "{deleteTarget?.name}" dari daftar menu?
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
                <TableHead className="text-center">Gambar</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-7 h-7 rounded object-cover inline-block" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{catIdToString(item.category_id)}</TableCell>
                  <TableCell className="text-right">Rp {Number(item.price).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">
                    <span className={item.stock_qty <= item.stock_min_threshold && item.stock_qty > 0 ? 'text-destructive font-medium' : ''}>
                      {item.stock_qty}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.is_available ? 'default' : 'destructive'} onClick={() => toggleAvailable(item)} className="cursor-pointer">
                      {item.is_available ? 'Tersedia' : 'Habis'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="link" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="link" size="sm" className="text-destructive" onClick={() => setDeleteTarget(item)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {items.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">Belum ada menu</p>}
        </CardContent>
      </Card>
    </div>
  );
}

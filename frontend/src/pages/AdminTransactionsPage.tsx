import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchOrders = useCallback(async () => {
    const { data } = await api.get('/orders', { params: { per_page: 50, from, to } });
    setOrders(data.data.data ?? data.data);
  }, [from, to]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const viewDetail = async (id: number) => {
    const { data } = await api.get(`/orders/${id}`);
    setSelected(data.data);
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default' as const;
      case 'cancelled': return 'destructive' as const;
      case 'pending': return 'secondary' as const;
      case 'received': return 'outline' as const;
      case 'in_progress': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Transaction History</h1>
          <p className="text-sm text-muted-foreground mt-1">Riwayat transaksi dan pesanan</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-36" />
          <span className="text-muted-foreground text-sm">-</span>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-36" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead className="text-center">Tipe</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{order.user?.name ?? '-'}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{order.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">Rp {Number(order.total_amount).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="link" size="sm" onClick={() => viewDetail(order.id)}>Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">Belum ada transaksi</p>}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selected.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{new Date(selected.created_at).toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Staff</span><span>{selected.user?.name ?? '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tipe</span><span className="capitalize">{selected.order_type === 'dine_in' ? 'Dine-In' : 'Takeaway'}</span></div>
                {selected.table && <div className="flex justify-between"><span className="text-muted-foreground">Meja</span><span>{selected.table.table_number}</span></div>}
                <hr className="my-2" />
                <p className="font-medium">Items</p>
                {selected.order_items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{item.menu_item?.name} x{item.quantity}</span>
                    <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">Rp {selected.total_amount.toLocaleString('id-ID')}</span></div>
                {selected.payment && (
                  <div className="text-xs text-muted-foreground space-y-1 mt-2">
                    <div className="flex justify-between"><span>Metode</span><span className="capitalize">{selected.payment.method === 'cash' ? 'Tunai' : 'QRIS'}</span></div>
                    <div className="flex justify-between"><span>Bayar</span><span>Rp {selected.payment.amount_paid.toLocaleString('id-ID')}</span></div>
                    {selected.payment.change_amount > 0 && <div className="flex justify-between"><span>Kembali</span><span>Rp {selected.payment.change_amount.toLocaleString('id-ID')}</span></div>}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Tutup</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

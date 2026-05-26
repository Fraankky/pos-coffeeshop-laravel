import { useState } from 'react';
import { MenuCatalog } from '@/components/MenuCatalog';
import { CartPanel } from '@/components/CartPanel';
import { OrderTypeSelector } from '@/components/OrderTypeSelector';
import { TableSelector } from '@/components/TableSelector';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { CashPayment } from '@/components/CashPayment';
import { QRISPayment } from '@/components/QRISPayment';
import { ReceiptPreview } from '@/components/ReceiptPreview';
import { useCartStore } from '@/stores/cartStore';
import api from '@/lib/api';
import type { Order } from '@/types';

type Step = 'menu' | 'checkout' | 'receipt';

export function KasirPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('menu');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableId, setTableId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris_simulated'>('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = () => { setStep('checkout'); setError(''); };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        order_type: orderType,
        table_id: orderType === 'dine_in' ? tableId : null,
        items: items.map((i) => ({
          menu_item_id: i.menuItem.id,
          quantity: i.quantity,
          size: i.size,
          toppings: i.toppings.length > 0 ? i.toppings : null,
          customization_notes: i.notes || null,
        })),
      };
      const { data: orderRes } = await api.post('/orders', payload);
      const order = orderRes.data;
      const { data: payRes } = await api.post(`/orders/${order.id}/payment`, {
        method: paymentMethod,
        amount_paid: paymentMethod === 'cash' ? amountPaid : subtotal(),
      });
      setCurrentOrder({ ...order, payment: payRes.data });
      setStep('receipt');
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'checkout') {
    return (
      <div className="max-w-lg mx-auto py-8">
        <button onClick={() => setStep('menu')} className="text-sm text-cream/50 mb-4 hover:text-cream transition-colors">
          ← Kembali ke menu
        </button>

        <div className="bg-espresso rounded-2xl border border-mocha/30 p-6 space-y-4 shadow-lg shadow-black/20">
          <h2 className="text-lg font-bold text-foam">Checkout</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <OrderTypeSelector orderType={orderType} onChange={setOrderType} />

          {orderType === 'dine_in' && (
            <TableSelector selected={tableId} onSelect={setTableId} />
          )}

          {orderType === 'dine_in' && !tableId && (
            <p className="text-xs text-red-400">Pilih meja terlebih dahulu</p>
          )}

          <div className="bg-mocha/20 rounded-2xl p-4 space-y-1 text-sm">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-milk">
                <span>{item.menuItem.name} x{item.quantity}</span>
                <span className="text-cream">Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <hr className="my-2 border-mocha/30" />
            <div className="flex justify-between font-bold">
              <span className="text-foam">Total</span>
              <span className="text-caramen">Rp {subtotal().toLocaleString('id-ID')}</span>
            </div>
          </div>

          <PaymentMethodSelector method={paymentMethod} onCash={() => setPaymentMethod('cash')} onQris={() => setPaymentMethod('qris_simulated')} />

          {paymentMethod === 'cash' && (
            <CashPayment total={subtotal()} amountPaid={amountPaid} onChange={setAmountPaid} onSubmit={handleSubmitOrder} />
          )}

          {paymentMethod === 'qris_simulated' && (
            <QRISPayment total={subtotal()} onConfirm={handleSubmitOrder} />
          )}

          {isSubmitting && <p className="text-center text-sm text-cream/50">Memproses...</p>}
        </div>
      </div>
    );
  }

  if (step === 'receipt' && currentOrder) {
    return <ReceiptPreview order={currentOrder} onClose={() => setStep('menu')} />;
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-6rem)]">
      <div className="flex-1 overflow-hidden">
        <MenuCatalog />
      </div>
      <div className="w-80 flex-shrink-0">
        <CartPanel onCheckout={handleCheckout} />
      </div>
    </div>
  );
}

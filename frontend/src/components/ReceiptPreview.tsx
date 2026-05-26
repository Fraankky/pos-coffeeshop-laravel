import type { Order } from '@/types';

interface Props {
  order: Order;
  onClose: () => void;
  onPrint?: () => void;
}

export function ReceiptPreview({ order, onClose, onPrint }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-espresso border border-mocha/40 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-4" id="receipt-content">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">☕</span>
            <h2 className="font-extrabold text-lg text-foam tracking-tight">POS Coffee</h2>
          </div>
          <p className="text-xs text-cream/50">Order #{order.id}</p>
          <p className="text-xs text-cream/50">{new Date(order.created_at).toLocaleString('id-ID')}</p>
          <hr className="my-3 border-dashed border-mocha/40" />

          <div className="text-left space-y-1 text-sm mb-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-milk">
                <span>{item.menu_item?.name} x{item.quantity}</span>
                <span className="text-cream">Rp {item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <hr className="my-3 border-dashed border-mocha/40" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-foam">Total</span>
            <span className="text-caramen">Rp {order.total_amount.toLocaleString('id-ID')}</span>
          </div>
          {order.payment && (
            <div className="text-xs text-cream/50 mt-2 space-y-1">
              <p>Metode: {order.payment.method === 'cash' ? 'Tunai' : 'QRIS'}</p>
              <p>Bayar: Rp {order.payment.amount_paid.toLocaleString('id-ID')}</p>
              {order.payment.change_amount > 0 && (
                <p>Kembali: Rp {order.payment.change_amount.toLocaleString('id-ID')}</p>
              )}
            </div>
          )}
          <hr className="my-3 border-dashed border-mocha/40" />
          <p className="text-xs text-cream/30">Terima kasih atas kunjungan Anda</p>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-mocha/30 text-cream/60 hover:text-cream transition-all text-sm font-medium">
            Tutup
          </button>
          <button
            onClick={onPrint || (() => window.print())}
            className="flex-1 px-4 py-2.5 rounded-xl bg-caramen text-white hover:bg-caramen-hover transition-all text-sm font-medium"
          >
            Cetak
          </button>
        </div>
      </div>
    </div>
  );
}

import type { Order } from '@/types';

interface Props {
  order: Order;
  onClose: () => void;
  onPrint?: () => void;
}

export function ReceiptPreview({ order, onClose, onPrint }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-4" id="receipt-content">
          <h2 className="font-bold text-lg">POS Coffee Shop</h2>
          <p className="text-xs text-gray-500">Order #{order.id}</p>
          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('id-ID')}</p>
          <hr className="my-3 border-dashed" />

          <div className="text-left space-y-1 text-sm mb-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.menu_item?.name} x{item.quantity}</span>
                <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <hr className="my-3 border-dashed" />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>Rp {order.total_amount.toLocaleString('id-ID')}</span>
          </div>
          {order.payment && (
            <div className="text-xs text-gray-500 mt-2">
              <p>Metode: {order.payment.method === 'cash' ? 'Tunai' : 'QRIS'}</p>
              <p>Bayar: Rp {order.payment.amount_paid.toLocaleString('id-ID')}</p>
              {order.payment.change_amount > 0 && (
                <p>Kembali: Rp {order.payment.change_amount.toLocaleString('id-ID')}</p>
              )}
            </div>
          )}
          <hr className="my-3 border-dashed" />
          <p className="text-xs text-gray-400">Terima kasih atas kunjungan Anda</p>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 text-sm">
            Tutup
          </button>
          <button
            onClick={onPrint || (() => window.print())}
            className="flex-1 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
          >
            Cetak
          </button>
        </div>
      </div>
    </div>
  );
}

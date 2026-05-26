import { useCartStore } from '@/stores/cartStore';

interface Props {
  onCheckout: () => void;
}

export function CartPanel({ onCheckout }: Props) {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-400 h-full flex flex-col items-center justify-center gap-2">
        <span className="text-4xl">🛒</span>
        <p className="text-sm">Belum ada item</p>
        <p className="text-xs">Pilih menu untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold">Pesanan ({totalItems()})</h2>
        <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700">Hapus semua</button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{item.menuItem.name}</p>
              <p className="text-xs text-gray-500">
                {item.size === 'small' ? 'S' : item.size === 'large' ? 'L' : 'M'}
                {item.toppings.length > 0 && ` · ${item.toppings.join(', ')}`}
              </p>
              {item.notes && <p className="text-xs text-gray-400 italic">Note: {item.notes}</p>}
              <p className="text-sm font-medium text-amber-700 mt-1">
                Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(i, item.quantity - 1)}
                className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >−</button>
              <span className="w-7 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(i, item.quantity + 1)}
                className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >+</button>
              <button
                onClick={() => removeItem(i)}
                className="ml-1 text-red-400 hover:text-red-600 text-sm"
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t mt-auto">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg text-amber-700">
            Rp {subtotal().toLocaleString('id-ID')}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-amber-700 text-white py-2.5 rounded-lg hover:bg-amber-800 font-medium"
        >
          Lanjut Bayar
        </button>
      </div>
    </div>
  );
}

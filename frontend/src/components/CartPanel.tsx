import { useCartStore } from '@/stores/cartStore';

interface Props {
  onCheckout: () => void;
}

export function CartPanel({ onCheckout }: Props) {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-espresso rounded-2xl border border-mocha/30 p-6 text-center text-cream/40 h-full flex flex-col items-center justify-center gap-2 shadow-lg shadow-black/20">
        <span className="text-4xl">🛒</span>
        <p className="text-sm">Belum ada item</p>
        <p className="text-xs">Pilih menu untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="bg-espresso rounded-2xl border border-mocha/30 h-full flex flex-col shadow-lg shadow-black/20">
      <div className="px-4 py-3 border-b border-mocha/30 flex items-center justify-between">
        <h2 className="font-semibold text-foam">Pesanan ({totalItems()})</h2>
        <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300 transition-colors">Hapus semua</button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-mocha/20 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-milk">{item.menuItem.name}</p>
              <p className="text-xs text-cream/50">
                {item.size === 'small' ? 'S' : item.size === 'large' ? 'L' : 'M'}
                {item.toppings.length > 0 && ` · ${item.toppings.join(', ')}`}
              </p>
              {item.notes && <p className="text-xs text-cream/30 italic">Note: {item.notes}</p>}
              <p className="text-sm font-medium text-cream mt-1">
                Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => updateQuantity(i, item.quantity - 1)} className="w-7 h-7 rounded-xl bg-latte/30 hover:bg-latte/50 text-cream text-sm transition-all">−</button>
              <span className="w-7 text-center text-sm text-milk font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(i, item.quantity + 1)} className="w-7 h-7 rounded-xl bg-latte/30 hover:bg-latte/50 text-cream text-sm transition-all">+</button>
              <button onClick={() => removeItem(i)} className="ml-1 text-red-400 hover:text-red-300 text-sm transition-colors">✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-mocha/30 mt-auto">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-milk">Total</span>
          <span className="font-bold text-lg text-caramen">
            Rp {subtotal().toLocaleString('id-ID')}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-caramen text-white py-2.5 rounded-xl hover:bg-caramen-hover transition-all duration-150 font-medium active:scale-[0.98]"
        >
          Lanjut Bayar
        </button>
      </div>
    </div>
  );
}

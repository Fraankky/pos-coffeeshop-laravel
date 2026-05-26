import { useState } from 'react';
import type { MenuItem } from '@/types';
import { useCartStore } from '@/stores/cartStore';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

const SIZES = ['small', 'regular', 'large'] as const;
const TOPPING_OPTIONS = ['Whipped Cream', 'Caramel', 'Chocolate Sauce', 'Vanilla', 'Extra Shot'];

export function ItemCustomizationModal({ item, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState<'small' | 'regular' | 'large'>('regular');
  const [toppings, setToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    addItem(item, size, toppings, notes);
    onClose();
  };

  const toggleTopping = (t: string) =>
    setToppings((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const sizePrice = size === 'small' ? item.price * 0.8 : size === 'large' ? item.price * 1.3 : item.price;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-espresso border border-mocha/40 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl shadow-black/40" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foam mb-1">{item.name}</h2>
        <p className="text-cream font-semibold mb-4">Rp {sizePrice.toLocaleString('id-ID')}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-cream/80 mb-2">Ukuran</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all duration-150
                  ${size === s
                    ? 'bg-caramen text-white border-caramen shadow-lg'
                    : 'bg-vanilla/5 text-cream/60 border-mocha/30 hover:border-cream/30'}`}
              >
                {s === 'small' ? 'S' : s === 'regular' ? 'M' : 'L'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-cream/80 mb-2">Topping</label>
          <div className="flex flex-wrap gap-2">
            {TOPPING_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTopping(t)}
                className={`px-3 py-1 rounded-full text-xs border transition-all duration-150
                  ${toppings.includes(t)
                    ? 'bg-caramen/20 text-caramen border-caramen/40'
                    : 'bg-vanilla/5 text-cream/60 border-mocha/30 hover:border-cream/30'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-cream/80 mb-1">Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: kurang gula..."
            className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-3 py-2 text-sm text-milk placeholder-cream/30 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-caramen"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-mocha/30 text-cream/60 hover:text-cream transition-all duration-150 text-sm font-medium">
            Batal
          </button>
          <button onClick={handleAdd} className="flex-1 px-4 py-2.5 rounded-xl bg-caramen text-white hover:bg-caramen-hover transition-all duration-150 text-sm font-medium active:scale-95">
            + Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

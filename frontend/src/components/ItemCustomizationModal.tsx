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

  const toggleTopping = (t: string) => {
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const sizePrice = size === 'small' ? item.price * 0.8 : size === 'large' ? item.price * 1.3 : item.price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">{item.name}</h2>
        <p className="text-amber-700 font-semibold mb-4">Rp {sizePrice.toLocaleString('id-ID')}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-1.5 rounded text-sm border capitalize
                  ${size === s ? 'bg-amber-700 text-white border-amber-700' : 'border-gray-300 hover:border-amber-300'}`}
              >
                {s === 'small' ? 'S' : s === 'regular' ? 'M' : 'L'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Topping</label>
          <div className="flex flex-wrap gap-2">
            {TOPPING_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTopping(t)}
                className={`px-3 py-1 rounded-full text-xs border
                  ${toppings.includes(t) ? 'bg-amber-100 text-amber-800 border-amber-300' : 'border-gray-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: kurang gula..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none h-16"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700">
            Batal
          </button>
          <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800">
            + Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

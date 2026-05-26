import type { MenuItem } from '@/types';

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAdd }: Props) {
  const isLowStock = item.stock_qty > 0 && item.stock_qty <= item.stock_min_threshold;
  const isOutOfStock = item.stock_qty === 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(item)}
      disabled={isOutOfStock}
      className={`bg-white rounded-lg shadow-sm border p-4 text-left transition hover:shadow-md
        ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-amber-300'}`}
    >
      <div className="h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded mb-3 flex items-center justify-center">
        <span className="text-3xl">{getItemEmoji(item.name)}</span>
      </div>
      <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
      <p className="text-amber-700 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
      {isLowStock && (
        <p className="text-xs text-red-500 mt-1">Stok: {item.stock_qty}</p>
      )}
      {isOutOfStock && (
        <p className="text-xs text-red-500 mt-1">Habis</p>
      )}
    </button>
  );
}

function getItemEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('espresso') || lower.includes('cappuccino') || lower.includes('latte') || lower.includes('americano') || lower.includes('mocha')) return '☕';
  if (lower.includes('matcha') || lower.includes('green tea')) return '🍵';
  if (lower.includes('chocolate') || lower.includes('red velvet')) return '🍫';
  if (lower.includes('orange') || lower.includes('juice')) return '🍊';
  if (lower.includes('croissant')) return '🥐';
  if (lower.includes('banana') || lower.includes('bread')) return '🍌';
  if (lower.includes('cheesecake')) return '🍰';
  if (lower.includes('french') || lower.includes('fries')) return '🍟';
  if (lower.includes('nasi') || lower.includes('mie') || lower.includes('wrap')) return '🍽️';
  if (lower.includes('thai tea') || lower.includes('earl grey')) return '🧋';
  return '🥤';
}

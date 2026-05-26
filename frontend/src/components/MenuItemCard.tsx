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
      className={`bg-espresso rounded-2xl border border-mocha/30 p-4 text-left transition-all duration-200
        ${isOutOfStock
          ? 'opacity-30 grayscale cursor-not-allowed'
          : 'cursor-pointer hover:border-cream/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30'}`}
    >
      <div className="h-24 bg-mocha/30 rounded-xl mb-3 flex items-center justify-center">
        <span className="text-3xl">{getItemEmoji(item.name)}</span>
      </div>
      <h3 className="font-semibold text-milk text-sm">{item.name}</h3>
      <p className="text-cream font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
      {isLowStock && (
        <p className="text-xs text-red-400 mt-1">Stok: {item.stock_qty}</p>
      )}
      {isOutOfStock && (
        <p className="text-xs text-red-400 mt-1">Habis</p>
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

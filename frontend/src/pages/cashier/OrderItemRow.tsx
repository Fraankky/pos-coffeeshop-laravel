import type { CartItem } from '@/stores/cartStore';

interface Props {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const FALLBACK_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23F5F5DC" width="100" height="100"/><text x="50" y="55" text-anchor="middle" font-size="30">☕</text></svg>';

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export function OrderItemRow({ item, onUpdateQty, onRemove, disabled = false }: Props) {
  return (
    <div className="flex gap-3 group">
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-cream-dark"
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="font-semibold text-gray-800 text-sm">{item.name}</h5>
            <p className="text-xs text-gray-500">
              {formatCurrency(item.price)} x{item.quantity}
            </p>
            {item.notes && (
              <p className="text-xs text-gray-400 mt-0.5">
                <i className="fas fa-sticky-note mr-1" />{item.notes}
              </p>
            )}
          </div>
          <span className="font-semibold text-gray-800 text-sm">{formatCurrency(item.price * item.quantity)}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              disabled={disabled}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-bronze hover:text-bronze transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              <i className="fas fa-minus text-[10px]" />
            </button>
            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              disabled={disabled}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-bronze hover:text-bronze transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              <i className="fas fa-plus text-[10px]" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="text-gray-300 hover:text-coral opacity-0 group-hover:opacity-100 transition-all text-xs disabled:cursor-not-allowed disabled:hover:text-gray-300"
          >
            <i className="fas fa-trash-alt" />
          </button>
        </div>
      </div>
    </div>
  );
}

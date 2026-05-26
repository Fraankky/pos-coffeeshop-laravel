import type { CartItem } from '@/stores/cartStore';

interface Props {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function OrderItemRow({ item, onUpdateQty, onRemove }: Props) {
  return (
    <div className="flex gap-3 group">
      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="font-semibold text-gray-800 text-sm">{item.name}</h5>
            <p className="text-xs text-gray-500">
              ${item.price.toFixed(1)} x{item.quantity} · {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
            </p>
            {item.notes && (
              <p className="text-xs text-gray-400 mt-0.5">
                <i className="fas fa-sticky-note mr-1" />{item.notes}
              </p>
            )}
          </div>
          <span className="font-semibold text-gray-800 text-sm">${(item.price * item.quantity).toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-forest hover:text-forest transition-colors"
            >
              <i className="fas fa-minus text-[10px]" />
            </button>
            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-forest hover:text-forest transition-colors"
            >
              <i className="fas fa-plus text-[10px]" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 hover:text-coral opacity-0 group-hover:opacity-100 transition-all text-xs"
          >
            <i className="fas fa-trash-alt" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useCartStore } from '@/stores/cartStore';
import { useCashierStore } from '@/stores/cashierStore';
import { TAX_RATE, ORDER_TYPES } from '@/lib/constants';
import { OrderItemRow } from './OrderItemRow';

interface Props {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

export function ReceiptSidebar({ onPlaceOrder, isSubmitting }: Props) {
  const { items, updateQuantity, removeItem } = useCartStore();
  const {
    orderType, setOrderType,
    customerName, setCustomerName,
    tableId, setTableId,
    tables,
  } = useCashierStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="w-96 bg-white rounded-2xl shadow-sm flex flex-col h-[calc(100vh-100px)]">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 bg-bronze rounded-full flex items-center justify-center text-white">
            <i className="fas fa-chevron-right" />
          </button>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">Purchase Receipt</h3>
            <p className="text-xs text-gray-500">#27362</p>
          </div>
          <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600">
            <i className="fas fa-bars" />
          </button>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1">
          {ORDER_TYPES.map((ot) => (
            <button
              key={ot.key}
              onClick={() => setOrderType(ot.key)}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all
                ${orderType === ot.key ? 'bg-bronze text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {ot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Customer name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Name"
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-bronze/20"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Table</label>
            <div className="relative">
              <select
                value={tableId ?? ''}
                onChange={(e) => setTableId(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-bronze/20 appearance-none"
              >
                <option value="">Select table</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 receipt-scroll">
        <h4 className="text-xs text-gray-500 mb-3">Order list</h4>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <i className="fas fa-shopping-cart text-3xl mb-2" />
            <p className="text-sm">Belum ada item</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onUpdateQty={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-100">
        <h4 className="text-xs text-gray-500 mb-3">Payment Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-800">${subtotal.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax</span>
            <span className="font-semibold text-gray-800">${tax.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-gray-100">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-bold text-gray-800">${total.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={onPlaceOrder}
          disabled={items.length === 0 || isSubmitting}
          className="w-full bg-bronze hover:bg-bronze-dark text-white rounded-full py-4 flex items-center justify-between px-6 transition-all shadow-lg shadow-bronze/20 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-arrow-right'} text-sm`} />
            </div>
            <span className="font-semibold">{isSubmitting ? 'Processing...' : 'Place Order'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">${total.toFixed(1)}</span>
            <i className="fas fa-chevron-right text-sm" />
          </div>
        </button>
      </div>
    </div>
  );
}

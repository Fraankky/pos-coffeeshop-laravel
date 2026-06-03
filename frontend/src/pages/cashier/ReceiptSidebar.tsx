import { useState, type ComponentType } from 'react';
import QRCodeImport from 'react-qr-code';
import { useCartStore } from '@/stores/cartStore';
import { useCashierStore } from '@/stores/cashierStore';
import { ORDER_TYPES } from '@/lib/constants';
import { OrderItemRow } from './OrderItemRow';
import type { Order } from '@/types';

interface Props {
  pendingOrder: Order | null;
  onPlaceOrder: () => void;
  onConfirmPayment: (method: 'cash' | 'qris_simulated', amountPaid: number) => void;
  isSubmitting: boolean;
  isPaying: boolean;
}

type QRCodeProps = {
  value: string;
  size?: number;
};

const QRCode = (
  (QRCodeImport as unknown as { default?: ComponentType<QRCodeProps> }).default ?? QRCodeImport
) as ComponentType<QRCodeProps>;

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export function ReceiptSidebar({ pendingOrder, onPlaceOrder, onConfirmPayment, isSubmitting, isPaying }: Props) {
  const { items, updateQuantity, removeItem } = useCartStore();
  const {
    orderType, setOrderType,
    customerName, setCustomerName,
    tableId, setTableId,
    tables,
  } = useCashierStore();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris_simulated'>('cash');
  const [cashAmount, setCashAmount] = useState('');

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const total = pendingOrder ? Number(pendingOrder.total_amount) : subtotal;
  const cashPaid = Number(cashAmount || 0);
  const changeAmount = Math.max(0, cashPaid - total);
  const isPaymentReady = paymentMethod === 'qris_simulated' || cashPaid >= total;
  const qrisPayload = JSON.stringify({ order_id: pendingOrder?.id, amount: total, method: 'qris_simulated' });

  const handleConfirmPayment = () => {
    onConfirmPayment(paymentMethod, paymentMethod === 'qris_simulated' ? total : cashPaid);
  };

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
              disabled={!!pendingOrder}
              className={`flex-1 py-2 text-xs font-medium rounded-full transition-all
                ${orderType === ot.key ? 'bg-bronze text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'} disabled:cursor-not-allowed disabled:opacity-70`}
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
              disabled={!!pendingOrder}
              placeholder="Name"
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-bronze/20 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Table</label>
            <div className="relative">
              <select
                value={tableId ?? ''}
                onChange={(e) => setTableId(e.target.value ? Number(e.target.value) : null)}
                disabled={!!pendingOrder}
                className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-bronze/20 appearance-none disabled:cursor-not-allowed disabled:opacity-70"
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
                disabled={!!pendingOrder}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-100">
        <h4 className="text-xs text-gray-500 mb-3">{pendingOrder ? `Payment Order #${pendingOrder.id}` : 'Payment Details'}</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-gray-100">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-bold text-gray-800">{formatCurrency(total)}</span>
          </div>
        </div>

        {pendingOrder && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all ${paymentMethod === 'cash' ? 'bg-bronze text-white border-bronze' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-bronze/30'}`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('qris_simulated')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all ${paymentMethod === 'qris_simulated' ? 'bg-bronze text-white border-bronze' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-bronze/30'}`}
              >
                QRIS
              </button>
            </div>

            {paymentMethod === 'cash' ? (
              <div className="space-y-2">
                <label className="text-xs text-gray-500 block">Nominal dibayar</label>
                <input
                  type="number"
                  min={total}
                  value={cashAmount}
                  placeholder={String(total)}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-bronze/20"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kembalian</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(changeAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <QRCode value={qrisPayload} size={132} />
                </div>
                <p className="text-xs text-gray-500 text-center">Scan QRIS simulasi untuk order #{pendingOrder.id}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-5 pt-0">
        {pendingOrder ? (
          <button
            onClick={handleConfirmPayment}
            disabled={!isPaymentReady || isPaying}
            className="w-full bg-bronze hover:bg-bronze-dark text-white rounded-full py-4 flex items-center justify-between px-6 transition-all shadow-lg shadow-bronze/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i className={`fas ${isPaying ? 'fa-spinner fa-spin' : 'fa-check'} text-sm`} />
              </div>
              <span className="font-semibold">{isPaying ? 'Confirming...' : 'Confirm Payment'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(total)}</span>
              <i className="fas fa-chevron-right text-sm" />
            </div>
          </button>
        ) : (
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
              <span className="font-bold">{formatCurrency(total)}</span>
              <i className="fas fa-chevron-right text-sm" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

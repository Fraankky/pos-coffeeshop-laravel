import { useState, useCallback, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useCashierStore } from '@/stores/cashierStore';
import { useAuthStore } from '@/stores/authStore';
import { CategoryTabs } from '@/pages/cashier/CategoryTabs';
import { ProductCard } from '@/pages/cashier/ProductCard';
import { ReceiptSidebar } from '@/pages/cashier/ReceiptSidebar';
import { CATEGORY_TABS, PRODUCT_IMAGES, PRICES } from '@/lib/constants';
import api from '@/lib/api';

export function KasirPage() {
  const { items, addItem, clearCart } = useCartStore();
  const { tableId, orderType, setTables, setStep, resetCheckout } = useCashierStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('coffee');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tables').then(({ data }) => {
      const t = data.data.map((table: any) => ({
        id: table.id,
        label: `${table.table_number} - ${table.capacity} seats`,
      }));
      setTables(t);
    });
  }, []);

  const categoryData = CATEGORY_TABS.find((c) => c.key === activeTab)!;
  const availableItems = categoryData?.items ?? [];
  const filteredItems = availableItems.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  const orderCounts = Object.fromEntries(
    CATEGORY_TABS.map((c) => [c.key, c.items.length])
  );

  const handleAddItem = useCallback((name: string) => {
    addItem({
      name,
      price: PRICES[name] || 4.0,
      size: 'regular',
      toppings: [],
      notes: '',
      image: PRODUCT_IMAGES[name] || PRODUCT_IMAGES.default,
    });
  }, [addItem]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        order_type: orderType,
        table_id: tableId,
        items: items.map((i) => ({
          menu_item_id: 1,
          quantity: i.quantity,
          size: i.size,
          customization_notes: i.notes || null,
        })),
      };

      const { data: orderRes } = await api.post('/orders', payload);
      const order = orderRes.data;

      await api.post(`/orders/${order.id}/payment`, {
        method: 'cash',
        amount_paid: order.total_amount,
      });

      setStep('receipt');
      clearCart();
      resetCheckout();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
            <i className="fas fa-leaf text-white text-sm" />
          </div>
          <div>
            <h1 className="font-bold text-forest text-sm leading-tight">GREEN<br />GROUNDS</h1>
            <p className="text-[10px] text-forest/70 -mt-0.5">COFFEE</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              Total : <span className="font-semibold text-gray-800">{items.length} Items</span>
            </span>
            <button
              onClick={() => handlePlaceOrder()}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium hover:shadow-md transition"
            >
              <span>Report</span>
              <i className="fas fa-file-alt text-gray-400" />
            </button>
          </div>
          <button className="relative p-2 hover:bg-white/50 rounded-full transition">
            <i className="fas fa-bell text-gray-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] rounded-full flex items-center justify-center font-bold">4</span>
          </button>
          <div className="flex items-center gap-3 bg-white rounded-full pl-1 pr-4 py-1 shadow-sm">
            <img
              src={`https://i.pravatar.cc/150?img=5`}
              alt="Cashier"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-800">{user?.name || 'Cashier'}</p>
              <p className="text-xs text-gray-500">Cashier</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-4 px-6 pb-6">
        <div className="flex-1">
          <div className="relative mb-4">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full bg-white rounded-full py-3 pl-12 pr-12 text-sm border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
              <i className="fas fa-th-large text-xs" />
            </button>
          </div>

          <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} orderCounts={orderCounts} />

          {error && (
            <div className="bg-coral-light border border-coral/20 text-coral px-4 py-3 rounded-2xl mb-4 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {filteredItems.map((name) => (
              <ProductCard
                key={name}
                name={name}
                price={PRICES[name] || 4.0}
                image={PRODUCT_IMAGES[name] || PRODUCT_IMAGES.default}
                onAdd={() => handleAddItem(name)}
              />
            ))}
          </div>
        </div>

        <ReceiptSidebar onPlaceOrder={handlePlaceOrder} isSubmitting={isSubmitting} />
      </div>

      <style>{`
        .receipt-scroll::-webkit-scrollbar { width: 4px; }
        .receipt-scroll::-webkit-scrollbar-track { background: transparent; }
        .receipt-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
      `}</style>
    </div>
  );
}

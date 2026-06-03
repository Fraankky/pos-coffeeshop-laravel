import { useState, useCallback, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useCashierStore } from '@/stores/cashierStore';
import { useAuthStore } from '@/stores/authStore';
import { CategoryTabs } from '@/pages/cashier/CategoryTabs';
import { ProductCard } from '@/pages/cashier/ProductCard';
import { ReceiptSidebar } from '@/pages/cashier/ReceiptSidebar';
import api from '@/lib/api';
import type { MenuItem, Category, Order, Table } from '@/types';

const CATEGORY_MAP: Record<string, string> = {
  coffee: 'Kopi',
  tea: 'Teh',
  snack: 'Makanan Ringan',
};

const PRODUCT_IMAGES: Record<string, string> = {
  Kopi: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&h=150&fit=crop',
  default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop',
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }

  return fallback;
};

export function KasirPage() {
  const { items, addItem, clearCart } = useCartStore();
  const { tableId, orderType, setTables, setStep, resetCheckout } = useCashierStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('coffee');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/menu-items', { params: { per_page: 100 } }),
      api.get('/tables'),
      api.get('/categories'),
    ]).then(([itemsRes, tablesRes, catRes]) => {
      setMenuItems(itemsRes.data.data.data);
      setCategories(catRes.data.data);
      const t = (tablesRes.data.data as Table[]).map((table) => ({
        id: table.id,
        label: `T${table.table_number} - ${table.capacity} seats ${table.status === 'occupied' ? '(occupied)' : ''}`,
      }));
      setTables(t);
      setIsLoading(false);
    });
  }, [setTables]);

  const filteredMenuItems = menuItems.filter((item) => {
    const cat = categories.find((c) => c.id === item.category_id);
    const catKey = Object.entries(CATEGORY_MAP).find(([, v]) => v === cat?.name)?.[0] || '';
    const matchesCategory = catKey === activeTab || !activeTab;
    const matchesSearch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch && item.is_available;
  });

  const countByCategory = (name: string) =>
    menuItems.filter((m) => categories.find((c) => c.id === m.category_id)?.name === name).length;

  const orderCounts = {
    coffee: countByCategory('Kopi'),
    tea: countByCategory('Teh'),
    snack: countByCategory('Makanan Ringan'),
  };

  const getProductImage = useCallback((item: MenuItem): string => {
    const catName = categories.find((c) => c.id === item.category_id)?.name;
    return PRODUCT_IMAGES[catName || ''] || PRODUCT_IMAGES.default;
  }, [categories]);

  const handleAddItem = useCallback((item: MenuItem) => {
    if (pendingOrder) return;

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.price),
      size: 'regular',
      toppings: [],
      notes: '',
      image: getProductImage(item),
    });
  }, [addItem, getProductImage, pendingOrder]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        order_type: orderType === 'order_online' ? 'takeaway' : orderType,
        table_id: orderType === 'dine_in' ? tableId : null,
        items: items.map((i) => ({
          menu_item_id: i.menuItemId,
          quantity: i.quantity,
          size: i.size,
          customization_notes: i.notes || null,
        })),
      };

      const { data: orderRes } = await api.post('/orders', payload);
      const order = orderRes.data;

      setPendingOrder(order);
      setStep('receipt');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Gagal memproses'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async (method: 'cash' | 'qris_simulated', amountPaid: number) => {
    if (!pendingOrder) return;
    setIsPaying(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.post(`/orders/${pendingOrder.id}/payment`, {
        method,
        amount_paid: amountPaid,
      });

      const paidOrderId = pendingOrder.id;
      setPendingOrder(null);
      clearCart();
      resetCheckout();
      setSuccessMessage(`Pembayaran order #${paidOrderId} berhasil dikonfirmasi.`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Gagal memproses pembayaran'));
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-bronze/30 border-t-bronze rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b border-cream-dark/50 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-bronze rounded-lg flex items-center justify-center shadow-sm">
            <i className="fas fa-leaf text-white text-sm" />
          </div>
          <div>
            <h1 className="font-bold text-espresso text-sm leading-tight tracking-tight">BREW & CO.</h1>
            <p className="text-[10px] text-gray-400 -mt-0.5">COFFEE</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 font-medium hidden md:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            <span className="font-semibold text-gray-700">{items.length}</span> items
          </span>
          <button className="relative p-2 hover:bg-white rounded-full transition-all hover:shadow-sm">
            <i className="fas fa-bell text-gray-500" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] rounded-full flex items-center justify-center font-bold">4</span>
          </button>
          <div className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 shadow-sm border border-cream-dark/30">
            <img
              src={`https://i.pravatar.cc/150?u=${user?.id || 5}`}
              alt=""
              className="w-7 h-7 rounded-full"
            />
            <div className="text-sm hidden sm:block">
              <p className="font-semibold text-gray-700 text-xs leading-tight">{user?.name || 'Cashier'}</p>
              <p className="text-[10px] text-gray-400">Cashier</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-4 px-6 py-4 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="relative mb-4 flex-shrink-0">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="w-full bg-white rounded-2xl py-3 pl-12 pr-12 text-sm border border-cream-dark/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-bronze/20 focus:border-bronze/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition text-xs"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} orderCounts={orderCounts} />

          {error && (
            <div className="bg-coral-light border border-coral/20 text-coral px-4 py-3 rounded-2xl mb-3 text-sm flex items-center gap-2 flex-shrink-0 animate-in slide-in-from-top-2">
              <i className="fas fa-exclamation-circle" />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl mb-3 text-sm flex items-center gap-2 flex-shrink-0 animate-in slide-in-from-top-2">
              <i className="fas fa-check-circle" />
              {successMessage}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {filteredMenuItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="fas fa-search text-4xl mb-3 opacity-30" />
                <p className="text-sm font-medium text-gray-500">Menu tidak ditemukan</p>
                <p className="text-xs mt-1">Coba cari dengan kata lain</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
                {filteredMenuItems.map((item) => {
                    return (
                      <ProductCard
                        key={item.id}
                        name={item.name}
                        price={Number(item.price)}
                        image={getProductImage(item)}
                        onAdd={() => handleAddItem(item)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <ReceiptSidebar
          pendingOrder={pendingOrder}
          onPlaceOrder={handlePlaceOrder}
          onConfirmPayment={handleConfirmPayment}
          isSubmitting={isSubmitting}
          isPaying={isPaying}
        />
      </div>

      <style>{`
        .receipt-scroll::-webkit-scrollbar { width: 4px; }
        .receipt-scroll::-webkit-scrollbar-track { background: transparent; }
        .receipt-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
        @keyframes slide-in-from-top-2 {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slide-in-from-top-2 0.2s ease-out; }
      `}</style>
    </div>
  );
}

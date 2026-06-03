import { useState } from 'react';
import { OrderPage } from '@/pages/OrderPage';
import { QueuePage } from '@/pages/QueuePage';

type StaffTab = 'order' | 'queue';

export function StaffPage() {
  const [activeTab, setActiveTab] = useState<StaffTab>('order');

  return (
    <div className="min-h-screen bg-cream">
      <div className="sticky top-0 z-40 border-b border-cream-dark/60 bg-white/85 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-espresso">Staff POS</h1>
            <p className="text-xs text-gray-500">Order, pembayaran, dan antrian dalam satu workflow</p>
          </div>
          <div className="rounded-2xl bg-gray-100 p-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('order')}
              className={`rounded-xl px-4 py-2 transition ${activeTab === 'order' ? 'bg-white text-espresso shadow-sm' : 'text-gray-500'}`}
            >
              Order
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`rounded-xl px-4 py-2 transition ${activeTab === 'queue' ? 'bg-white text-espresso shadow-sm' : 'text-gray-500'}`}
            >
              Antrian
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'order' ? (
        <OrderPage />
      ) : (
        <div className="min-h-screen bg-[#12100c] p-6">
          <QueuePage />
        </div>
      )}
    </div>
  );
}

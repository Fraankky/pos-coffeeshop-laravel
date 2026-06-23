import type { Category } from '@/types';

interface Props {
  activeTab: string;
  onTabChange: (key: string) => void;
  categories: Category[];
  orderCounts: Record<string, number>;
}

const CATEGORY_ICONS: Record<string, string> = {
  Kopi: '☕',
  'Non-Kopi': '🥤',
  Teh: '🍵',
  'Makanan Ringan': '🥐',
  'Makanan Berat': '🍽️',
};

const defaultIcon = '📋';

export function CategoryTabs({ activeTab, onTabChange, categories, orderCounts }: Props) {
  return (
    <div className="flex gap-3 mb-4">
      {categories.map((cat) => {
        const isActive = activeTab === String(cat.id);
        const count = orderCounts[String(cat.id)] || 0;
        const icon = CATEGORY_ICONS[cat.name] || defaultIcon;
        return (
          <button
            key={cat.id}
            onClick={() => onTabChange(String(cat.id))}
            className={`flex-1 min-w-0 rounded-2xl p-4 text-left relative overflow-hidden h-28 transition-all duration-200
              ${isActive ? 'bg-bronze text-white shadow-lg shadow-bronze/20' : 'bg-white text-gray-800 hover:shadow-md'}`}
          >
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] mb-2 font-medium
              ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {count > 0 ? `${count}` : '0'}
            </span>
            <h3 className="text-sm font-bold truncate">{cat.name}</h3>
            <p className={`text-[10px] leading-tight ${isActive ? 'opacity-80' : 'text-gray-500'}`}>
              {cat.description || ''}
            </p>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-2xl opacity-15">
              {icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}

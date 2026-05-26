import { CoffeeIcon, TeaIcon, SnackIcon } from '@/components/icons/CategoryIcons';

interface Props {
  activeTab: string;
  onTabChange: (key: string) => void;
  orderCounts: Record<string, number>;
}

const TABS = [
  { key: 'coffee', label: 'Coffee', badge: 'Available', icon: CoffeeIcon },
  { key: 'tea', label: 'Tea', badge: 'Available', icon: TeaIcon },
  { key: 'snack', label: 'Snack', badge: 'Need to re-stock', icon: SnackIcon, isAlert: true },
];

export function CategoryTabs({ activeTab, onTabChange, orderCounts }: Props) {
  return (
    <div className="flex gap-3 mb-4">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 rounded-2xl p-4 text-left relative overflow-hidden h-28 transition-all duration-200
              ${isActive ? 'bg-forest text-white shadow-lg shadow-forest/20' : 'bg-white text-gray-800 hover:shadow-md'}`}
          >
            <span className={`inline-block px-3 py-1 rounded-full text-xs mb-2 font-medium
              ${isActive
                ? 'bg-white/20 text-white'
                : tab.isAlert
                  ? 'bg-coral-light text-coral'
                  : 'bg-gray-100 text-gray-600'}`}>
              {tab.isAlert && <i className="fas fa-exclamation-circle mr-1" />}
              {tab.badge}
            </span>
            <h3 className="text-xl font-bold">{tab.label}</h3>
            <p className={`text-sm ${isActive ? 'opacity-80' : 'text-gray-500'}`}>
              {orderCounts[tab.key] || 0} Items
            </p>
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 ${isActive ? 'opacity-20' : 'opacity-10'}`}>
              <Icon />
            </div>
          </button>
        );
      })}
    </div>
  );
}

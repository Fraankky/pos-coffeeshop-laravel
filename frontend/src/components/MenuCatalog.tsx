import { useEffect, useState } from 'react';
import { useMenuStore } from '@/stores/menuStore';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ItemCustomizationModal } from '@/components/ItemCustomizationModal';
import type { MenuItem } from '@/types';

export function MenuCatalog() {
  const { categories, items, selectedCategoryId, isLoading, fetchCategories, setSelectedCategory } = useMenuStore();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-xl text-sm whitespace-nowrap font-medium transition-all duration-150
              ${selectedCategoryId === cat.id
                ? 'bg-caramen text-white shadow-lg shadow-black/20'
                : 'bg-espresso text-cream/60 hover:text-cream border border-mocha/30'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-mocha/30 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-cream/40">
          <span className="text-4xl mb-2">📭</span>
          <p className="text-sm">Tidak ada menu di kategori ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-auto pb-4">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={setSelectedItem} />
          ))}
        </div>
      )}

      {selectedItem && (
        <ItemCustomizationModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

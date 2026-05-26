import { useEffect, useState } from 'react';
import { useMenuStore } from '@/stores/menuStore';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ItemCustomizationModal } from '@/components/ItemCustomizationModal';
import type { MenuItem } from '@/types';

export function MenuCatalog() {
  const { categories, items, selectedCategoryId, isLoading, fetchCategories, setSelectedCategory } = useMenuStore();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition
              ${selectedCategoryId === cat.id
                ? 'bg-amber-700 text-white border-amber-700'
                : 'bg-white border-gray-300 hover:border-amber-300 text-gray-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
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
        <ItemCustomizationModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

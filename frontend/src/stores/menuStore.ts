import { create } from 'zustand';
import api from '@/lib/api';
import type { Category, MenuItem } from '@/types';

interface MenuState {
  categories: Category[];
  items: MenuItem[];
  selectedCategoryId: number | null;
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  fetchItems: (categoryId?: number) => Promise<void>;
  setSelectedCategory: (id: number | null) => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  items: [],
  selectedCategoryId: null,
  isLoading: false,

  fetchCategories: async () => {
    const { data } = await api.get('/categories');
    set({ categories: data.data });
  },

  fetchItems: async (categoryId?: number) => {
    set({ isLoading: true });
    const params: Record<string, string> = { available_only: 'true', per_page: '100' };
    if (categoryId) params.category_id = String(categoryId);
    const { data } = await api.get('/menu-items', { params });
    set({ items: data.data.data, isLoading: false });
  },

  setSelectedCategory: (id: number | null) => {
    set({ selectedCategoryId: id });
    get().fetchItems(id ?? undefined);
  },
}));

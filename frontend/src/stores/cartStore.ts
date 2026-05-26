import { create } from 'zustand';
import type { MenuItem } from '@/types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  size: 'small' | 'regular' | 'large';
  toppings: string[];
  notes: string;
}

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem, size?: 'small' | 'regular' | 'large', toppings?: string[], notes?: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  updateNotes: (index: number, notes: string) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (menuItem, size = 'regular', toppings = [], notes = '') => {
    const existing = get().items.findIndex(
      (i) => i.menuItem.id === menuItem.id && i.size === size
    );

    if (existing >= 0) {
      const items = [...get().items];
      items[existing].quantity += 1;
      set({ items });
    } else {
      set({
        items: [...get().items, { menuItem, quantity: 1, size, toppings, notes }],
      });
    }
  },

  removeItem: (index) => {
    set({ items: get().items.filter((_, i) => i !== index) });
  },

  updateQuantity: (index, quantity) => {
    if (quantity <= 0) {
      get().removeItem(index);
      return;
    }
    const items = [...get().items];
    items[index].quantity = quantity;
    set({ items });
  },

  updateNotes: (index, notes) => {
    const items = [...get().items];
    items[index].notes = notes;
    set({ items });
  },

  clearCart: () => set({ items: [] }),

  subtotal: () => get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

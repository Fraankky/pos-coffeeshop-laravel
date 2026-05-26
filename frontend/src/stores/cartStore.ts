import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: 'small' | 'regular' | 'large';
  toppings: string[];
  notes: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
}

let idCounter = 0;
const genId = () => `cart_${++idCounter}`;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.findIndex(
      (i) => i.name === item.name && i.size === item.size && i.notes === item.notes
    );
    if (existing >= 0) {
      const items = [...get().items];
      items[existing].quantity += 1;
      set({ items });
    } else {
      set({ items: [...get().items, { ...item, id: genId(), quantity: 1 }] });
    }
  },

  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) { get().removeItem(id); return; }
    set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) });
  },

  updateNotes: (id, notes) => {
    set({ items: get().items.map((i) => i.id === id ? { ...i, notes } : i) });
  },

  clearCart: () => set({ items: [] }),
}));

import { create } from 'zustand';

export type OrderType = 'dine_in' | 'takeaway' | 'order_online';

interface CashierState {
  orderType: OrderType;
  customerName: string;
  tableId: number | null;
  tables: { id: number; label: string }[];
  step: 'menu' | 'receipt';
  setOrderType: (type: OrderType) => void;
  setCustomerName: (name: string) => void;
  setTableId: (id: number | null) => void;
  setTables: (tables: { id: number; label: string }[]) => void;
  setStep: (step: 'menu' | 'receipt') => void;
  resetCheckout: () => void;
}

export const useCashierStore = create<CashierState>((set) => ({
  orderType: 'dine_in',
  customerName: '',
  tableId: null,
  tables: [],
  step: 'menu',

  setOrderType: (orderType) => set({ orderType }),
  setCustomerName: (customerName) => set({ customerName }),
  setTableId: (tableId) => set({ tableId }),
  setTables: (tables) => set({ tables }),
  setStep: (step) => set({ step }),

  resetCheckout: () => set({
    orderType: 'dine_in',
    customerName: '',
    tableId: null,
    step: 'menu',
  }),
}));

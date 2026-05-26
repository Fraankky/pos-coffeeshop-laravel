export interface User {
  id: number;
  name: string;
  email: string;
  role: 'kasir' | 'barista' | 'admin';
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  is_available: boolean;
  stock_qty: number;
  stock_min_threshold: number;
  category?: Category;
}

export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  status: 'available' | 'occupied';
}

export interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  customization_notes: string | null;
  subtotal: number;
  size: 'small' | 'regular' | 'large';
  toppings: string[] | null;
  menu_item?: MenuItem;
}

export interface Order {
  id: number;
  user_id: number;
  table_id: number | null;
  order_type: 'dine_in' | 'takeaway';
  status: 'pending' | 'received' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
  order_items?: OrderItem[];
  payment?: Payment;
  user?: User;
  table?: Table;
}

export interface Payment {
  id: number;
  order_id: number;
  method: 'cash' | 'qris_simulated';
  amount_paid: number;
  change_amount: number;
  payment_status: 'pending' | 'confirmed' | 'cancelled';
  confirmed_at: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

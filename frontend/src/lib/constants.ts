export const CATEGORY_TABS = [
  {
    key: 'coffee',
    label: 'Coffee',
    badge: 'Available',
    badgeColor: 'white/20',
    items: ['Espresso', 'Cappuccino', 'Latte', 'Americano', 'Mocha', 'Iced Coffee Milk', 'Cold Brew', 'Flat White', 'Caramel Mac', 'Salted Caramel', 'Hazelnut Latte', 'Pour Over'],
  },
  {
    key: 'tea',
    label: 'Tea',
    badge: 'Available',
    badgeColor: 'gray-100',
    items: ['Green Tea', 'Earl Grey', 'Thai Tea', 'Matcha Latte'],
  },
  {
    key: 'snack',
    label: 'Snack',
    badge: 'Need to re-stock',
    badgeColor: 'coral-light',
    items: ['Croissant', 'Banana Bread', 'Cheesecake', 'French Fries'],
  },
] as const;

export const TAX_RATE = 0.10;

export const ORDER_TYPES = [
  { key: 'dine_in', label: 'Dine In' },
  { key: 'takeaway', label: 'Take Away' },
  { key: 'order_online', label: 'Order Online' },
] as const;

export const PRODUCT_IMAGES: Record<string, string> = {
  Espresso: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=150&h=150&fit=crop',
  Cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=150&h=150&fit=crop',
  Latte: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=150&h=150&fit=crop',
  Americano: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=150&h=150&fit=crop',
  Mocha: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=150&h=150&fit=crop',
  'Iced Coffee Milk': 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?w=150&h=150&fit=crop',
  'Cold Brew': 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=150&h=150&fit=crop',
  'Flat White': 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=150&h=150&fit=crop',
  'Caramel Mac': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=150&h=150&fit=crop',
  'Salted Caramel': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=150&h=150&fit=crop',
  'Hazelnut Latte': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=150&h=150&fit=crop',
  'Pour Over': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop',
  default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop',
};

export const PRICES: Record<string, number> = {
  Espresso: 4.2,
  Cappuccino: 3.3,
  Latte: 4.0,
  Americano: 4.0,
  Mocha: 4.0,
  'Iced Coffee Milk': 3.8,
  'Cold Brew': 4.0,
  'Flat White': 3.8,
  'Caramel Mac': 4.0,
  'Salted Caramel': 4.2,
  'Hazelnut Latte': 4.0,
  'Pour Over': 4.0,
  'Green Tea': 3.0,
  'Earl Grey': 3.0,
  'Thai Tea': 3.5,
  'Matcha Latte': 4.0,
  Croissant: 3.5,
  'Banana Bread': 3.0,
  Cheesecake: 4.5,
  'French Fries': 3.0,
};

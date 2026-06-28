# DB_DESIGN.md — Database Design

## POS Coffee Shop — MySQL 8 Schema Documentation

---

## 1. Entity Relationship Diagram (ERD)

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  users   │       │    orders    │       │  tables  │
├──────────┤       ├──────────────┤       ├──────────┤
│ id (PK)  │──┐    │ id (PK)      │    ┌──│ id (PK)  │
│ name     │  │    │ user_id (FK) │◄───┤  │ number   │
│ email    │  │    │ table_id(FK) │    │  │ capacity │
│ password │  │    │ order_type   │    │  │ status   │
│ role     │  │    │ status       │    │  └──────────┘
│ is_active│  │    │ total_amount │    │
│ ...      │  │    │ created_at   │    │
└──────────┘  │    └──────┬───────┘    │
              │           │ 1           │
              │           │             │
              │    ┌──────┴──────────┐  │
              │    │   order_items   │  │
              │    ├─────────────────┤  │
              │    │ id (PK)         │  │
              │    │ order_id (FK)   │  │
              │    │ menu_item_id(FK)│──┼────┐
              │    │ quantity        │  │    │
              │    │ unit_price      │  │    │
              │    │ subtotal        │  │    │
              │    │ customization   │  │    │
              │    └─────────────────┘  │    │
              │                         │    │
              │    ┌──────────────┐     │    │
              │    │  payments    │     │    │
              │    ├──────────────┤     │    │
              │    │ id (PK)      │     │    │
              └───►│ order_id(FK) │     │    │
                   │ method       │     │    │
                   │ amount_paid  │     │    │
                   │ change_amount│     │    │
                   │ payment_     │     │    │
                   │   status     │     │    │
                   │ confirmed_at │     │    │
                   └──────────────┘     │    │
                                        │    │
┌──────────────┐                        │    │
│  categories  │                        │    │
├──────────────┤                        │    │
│ id (PK)      │◄───────────────────────┼────┘
│ name         │                        │
│ description  │                        │
│ is_active    │              ┌─────────┴──────┐
└──────────────┘              │  menu_items    │
                              ├────────────────┤
                              │ id (PK)        │
                              │ category_id(FK)│
                              │ name           │
                              │ description    │
                              │ price          │
                              │ image          │
                              │ is_available   │
                              │ stock_qty      │
                              │ stock_min_     │
                              │   threshold    │
                              └────────────────┘
```

### Relationship Summary

| From | To | Cardinality | Description |
|------|----|-------------|-------------|
| users | orders | 1 : N | One staff/admin user creates many orders |
| tables | orders | 1 : N | One table used for many orders |
| orders | order_items | 1 : N | One order contains many items |
| menu_items | order_items | 1 : N | One menu item appears in many order items |
| orders | payments | 1 : 1 | One order has exactly one payment |
| categories | menu_items | 1 : N | One category has many menu items |

---

## 2. Table Schemas

### 2.1 `users`

```sql
CREATE TABLE users (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255)    NOT NULL,
    email         VARCHAR(255)    NOT NULL,
    password      VARCHAR(255)    NOT NULL,
    role          ENUM('staff', 'admin') NOT NULL DEFAULT 'staff',
    is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP       NULL DEFAULT NULL,
    updated_at    TIMESTAMP       NULL DEFAULT NULL,

    UNIQUE INDEX users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | Display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login identifier |
| password | VARCHAR(255) | NOT NULL | bcrypt hash (min 60 chars) |
| role | ENUM | NOT NULL, DEFAULT 'staff' | staff / admin |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft disable account |
| created_at | TIMESTAMP | NULLABLE | Laravel timestamp |
| updated_at | TIMESTAMP | NULLABLE | Laravel timestamp |

---

### 2.2 `categories`

```sql
CREATE TABLE categories (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255)    NOT NULL,
    description   TEXT            NULL,
    is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP       NULL DEFAULT NULL,
    updated_at    TIMESTAMP       NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | e.g. "Kopi", "Non-Kopi", "Makanan" |
| description | TEXT | NULLABLE | Optional category description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Hide category without deleting |
| created_at | TIMESTAMP | NULLABLE | |
| updated_at | TIMESTAMP | NULLABLE | |

---

### 2.3 `tables`

```sql
CREATE TABLE tables (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    table_number  VARCHAR(10)     NOT NULL,
    capacity      INT             NOT NULL DEFAULT 4,
    status        ENUM('available', 'occupied') NOT NULL DEFAULT 'available',
    created_at    TIMESTAMP       NULL DEFAULT NULL,
    updated_at    TIMESTAMP       NULL DEFAULT NULL,

    UNIQUE INDEX tables_number_unique (table_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| table_number | VARCHAR(10) | NOT NULL, UNIQUE | e.g. "1", "2", "VIP-1" |
| capacity | INT | NOT NULL, DEFAULT 4 | Max guests |
| status | ENUM | NOT NULL, DEFAULT 'available' | available / occupied |
| created_at | TIMESTAMP | NULLABLE | |
| updated_at | TIMESTAMP | NULLABLE | |

---

### 2.4 `menu_items`

```sql
CREATE TABLE menu_items (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id         BIGINT UNSIGNED NOT NULL,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT            NULL,
    price               DECIMAL(10, 2)  NOT NULL,
    image               VARCHAR(255)    NULL,
    is_available       BOOLEAN         NOT NULL DEFAULT TRUE,
    stock_qty           INT             NOT NULL DEFAULT 0,
    stock_min_threshold INT             NOT NULL DEFAULT 5,
    created_at          TIMESTAMP       NULL DEFAULT NULL,
    updated_at          TIMESTAMP       NULL DEFAULT NULL,

    INDEX menu_items_category_id_foreign (category_id),
    INDEX menu_items_is_available_index (is_available),
    CONSTRAINT menu_items_category_id_foreign
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| category_id | BIGINT UNSIGNED | FK → categories, NOT NULL | |
| name | VARCHAR(255) | NOT NULL | e.g. "Cappuccino", "Americano" |
| description | TEXT | NULLABLE | |
| price | DECIMAL(10,2) | NOT NULL | Price in IDR |
| image | VARCHAR(255) | NULLABLE | Path in storage |
| is_available | BOOLEAN | NOT NULL, DEFAULT TRUE | Show/hide in menu |
| stock_qty | INT | NOT NULL, DEFAULT 0 | Current stock |
| stock_min_threshold | INT | NOT NULL, DEFAULT 5 | Alert when qty <= this |
| created_at | TIMESTAMP | NULLABLE | |
| updated_at | TIMESTAMP | NULLABLE | |

---

### 2.5 `orders`

```sql
CREATE TABLE orders (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT UNSIGNED NOT NULL,
    table_id      BIGINT UNSIGNED NULL,
    order_type    ENUM('dine_in', 'takeaway') NOT NULL,
    status        ENUM('pending', 'received', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    total_amount  DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    created_at    TIMESTAMP       NULL DEFAULT NULL,
    updated_at    TIMESTAMP       NULL DEFAULT NULL,

    INDEX orders_user_id_foreign (user_id),
    INDEX orders_table_id_foreign (table_id),
    INDEX orders_status_index (status),
    INDEX orders_created_at_index (created_at),

    CONSTRAINT orders_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT orders_table_id_foreign
        FOREIGN KEY (table_id) REFERENCES tables (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| user_id | BIGINT UNSIGNED | FK → users, NOT NULL | Staff/admin who created order |
| table_id | BIGINT UNSIGNED | FK → tables, NULLABLE | NULL for takeaway |
| order_type | ENUM | NOT NULL | dine_in / takeaway |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Order lifecycle |
| total_amount | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Sum of order items |
| created_at | TIMESTAMP | NULLABLE | |
| updated_at | TIMESTAMP | NULLABLE | |

**Order Status Flow**:

```
pending → received → in_progress → completed
   │                                    ↑
   └──────── cancelled ←────────────────┘
```

---

### 2.6 `order_items`

```sql
CREATE TABLE order_items (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT UNSIGNED NOT NULL,
    menu_item_id        BIGINT UNSIGNED NOT NULL,
    quantity            INT             NOT NULL DEFAULT 1,
    unit_price          DECIMAL(10, 2)  NOT NULL,
    customization_notes TEXT            NULL,
    subtotal            DECIMAL(10, 2)  NOT NULL,
    size                ENUM('small', 'regular', 'large') NOT NULL DEFAULT 'regular',
    toppings            JSON            NULL,
    created_at          TIMESTAMP       NULL DEFAULT NULL,
    updated_at          TIMESTAMP       NULL DEFAULT NULL,

    INDEX order_items_order_id_foreign (order_id),
    INDEX order_items_menu_item_id_foreign (menu_item_id),

    CONSTRAINT order_items_order_id_foreign
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT order_items_menu_item_id_foreign
        FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| order_id | BIGINT UNSIGNED | FK → orders, NOT NULL, CASCADE delete | |
| menu_item_id | BIGINT UNSIGNED | FK → menu_items, NOT NULL | |
| quantity | INT | NOT NULL, DEFAULT 1 | |
| unit_price | DECIMAL(10,2) | NOT NULL | Snapshot of menu_item price at order time |
| customization_notes | TEXT | NULLABLE | Free text (e.g. "less sugar") |
| subtotal | DECIMAL(10,2) | NOT NULL | quantity × unit_price |
| size | ENUM | NOT NULL, DEFAULT 'regular' | small / regular / large |
| toppings | JSON | NULLABLE | Array of topping names, e.g. `["whipped cream", "caramel"]` |
| created_at | TIMESTAMP | NULLABLE | |
| updated_at | TIMESTAMP | NULLABLE | |

---

### 2.7 `payments`

```sql
CREATE TABLE payments (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    method          ENUM('cash', 'qris_simulated') NOT NULL,
    amount_paid     DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    change_amount   DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    payment_status  ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    confirmed_at    TIMESTAMP       NULL DEFAULT NULL,
    created_at      TIMESTAMP       NULL DEFAULT NULL,
    updated_at      TIMESTAMP       NULL DEFAULT NULL,

    UNIQUE INDEX payments_order_id_unique (order_id),

    CONSTRAINT payments_order_id_foreign
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| order_id | BIGINT UNSIGNED | FK → orders, UNIQUE, NOT NULL | 1:1 relation |
| method | ENUM | NOT NULL | cash / qris_simulated |
| amount_paid | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Amount given by customer |
| change_amount | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | amount_paid - order.total_amount (cash only) |
| payment_status | ENUM | NOT NULL, DEFAULT 'pending' | pending / confirmed / cancelled |
| confirmed_at | TIMESTAMP | NULLABLE | Timestamp when payment confirmed |
| created_at | TIMESTAMP | NULLABLE | |
| updated_at | TIMESTAMP | NULLABLE | |

---

## 3. Indexes Summary

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| users | email | UNIQUE | Login lookup |
| tables | table_number | UNIQUE | Unique table numbers |
| menu_items | category_id | INDEX | Filter items by category |
| menu_items | is_available | INDEX | Filter available items |
| orders | user_id | INDEX | Orders by staff/admin user |
| orders | table_id | INDEX | Orders by table |
| orders | status | INDEX | Filter active orders (staff queue polling) |
| orders | created_at | INDEX | Date range reports |
| order_items | order_id | INDEX | Items in order |
| order_items | menu_item_id | INDEX | Top selling items report |
| payments | order_id | UNIQUE | 1:1 order-payment lookup |

---

## 4. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `unit_price` stored in `order_items` | Price snapshot at order time — prevents price change from affecting historical orders |
| `toppings` as JSON column | Flexible key-value for customizations without extra table; MySQL 8 supports JSON natively |
| `stock_qty` on `menu_items` | Simple stock tracking; v2 could add `inventory_transactions` table for audit trail |
| `change_amount` on `payments` | Store calculated change to avoid recomputation; serves as receipt record |
| `ON DELETE RESTRICT` for `menu_items` | Prevent deletion if item exists in historical orders |
| `ON DELETE CASCADE` for `order_items` | Clean up items when parent order is deleted |
| `ON DELETE SET NULL` for `orders.table_id` | Allow table deletion without affecting order history |
| Enum columns (not separate tables) | Roles, statuses, and types are finite and stable — enums simplify queries |
| Timestamps nullable | Following Laravel convention (`$table->timestamps()` produces nullable timestamps) |

---

## 5. Seed Data Strategy

### Demo users
| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@flocoffee.com | password | admin |
| Staff 1 | staff@flocoffee.com | password | staff |

### Demo categories (Coffee Shop themed)
- Kopi (Coffee)
- Non-Kopi (Non-Coffee)
- Teh (Tea)
- Makanan Ringan (Snacks)
- Makanan Berat (Heavy Meals)

### Demo menu items (sample)
| Name | Category | Price |
|------|----------|-------|
| Espresso | Kopi | 18,000 |
| Cappuccino | Kopi | 25,000 |
| Latte | Kopi | 25,000 |
| Americano | Kopi | 22,000 |
| Matcha Latte | Non-Kopi | 28,000 |
| Chocolate | Non-Kopi | 25,000 |
| Green Tea | Teh | 15,000 |
| Croissant | Makanan Ringan | 20,000 |
| Nasi Goreng | Makanan Berat | 30,000 |

### Demo tables
10 tables (T1-T10), capacities 2-6, all available.

---

## 6. Migration Order

```
1. create_users_table
2. create_categories_table
3. create_tables_table
4. create_menu_items_table          (FK: categories)
5. create_orders_table              (FK: users, tables)
6. create_order_items_table         (FK: orders, menu_items)
7. create_payments_table            (FK: orders)
```

---

## 7. Query Patterns (Common)

### 7.1 Active Orders for Staff Queue (Polling)
```sql
SELECT o.*, oi.*, mi.name, mi.image
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN menu_items mi ON mi.id = oi.menu_item_id
WHERE o.status IN ('received', 'in_progress')
  AND o.updated_at > ?
ORDER BY o.created_at ASC;
```

### 7.2 Daily Sales Report
```sql
SELECT DATE(created_at) as date,
       COUNT(*) as order_count,
       SUM(total_amount) as total_revenue
FROM orders
WHERE status = 'completed'
  AND created_at BETWEEN ? AND ?
GROUP BY DATE(created_at)
ORDER BY date;
```

### 7.3 Top Selling Items
```sql
SELECT mi.name, mi.price,
       SUM(oi.quantity) as total_sold,
       SUM(oi.subtotal) as total_revenue
FROM order_items oi
JOIN menu_items mi ON mi.id = oi.menu_item_id
JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'completed'
  AND o.created_at BETWEEN ? AND ?
GROUP BY mi.id, mi.name, mi.price
ORDER BY total_sold DESC
LIMIT 10;
```

### 7.4 Low Stock Alert
```sql
SELECT id, name, stock_qty, stock_min_threshold
FROM menu_items
WHERE is_available = TRUE
  AND stock_qty <= stock_min_threshold;
```

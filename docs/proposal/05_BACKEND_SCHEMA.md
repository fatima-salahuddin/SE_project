# Backend Database Schema
### E-Commerce Marketplace Management System
**FAST-NUCES Karachi | Section B | SE Project 2024-2025**

---

## 5.1 Entity Relationship Overview

9 core tables with enforced referential integrity. All primary keys use Oracle sequences for auto-increment behavior.

```
USERS
  |
  |---< PRODUCTS (as seller_id)
  |       |---< ORDER_ITEMS
  |       |---< CART_ITEMS
  |       |---< REVIEWS
  |
  |---< ORDERS (as customer_id)
  |       |---< ORDER_ITEMS
  |
  |---< REVIEWS (as customer_id)
  |---< CART_ITEMS (as user_id)

CATEGORIES
  |---< PRODUCTS
  |---< CATEGORIES (self-ref: parent_id)
```

---

## 5.2 Table Definitions

### USERS

```sql
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE users (
    user_id         NUMBER          DEFAULT users_seq.NEXTVAL PRIMARY KEY,
    email           VARCHAR2(255)   NOT NULL UNIQUE,
    password_hash   VARCHAR2(255)   NOT NULL,
    full_name       VARCHAR2(100)   NOT NULL,
    role            VARCHAR2(20)    NOT NULL CHECK (role IN ('Customer', 'Seller', 'Admin')),
    status          VARCHAR2(20)    DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP
);
```

---

### CATEGORIES

```sql
CREATE SEQUENCE categories_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE categories (
    category_id     NUMBER          DEFAULT categories_seq.NEXTVAL PRIMARY KEY,
    name            VARCHAR2(100)   NOT NULL UNIQUE,
    parent_id       NUMBER          REFERENCES categories(category_id) ON DELETE SET NULL,
    description     VARCHAR2(500)
);
```

---

### PRODUCTS

```sql
CREATE SEQUENCE products_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE products (
    product_id      NUMBER          DEFAULT products_seq.NEXTVAL PRIMARY KEY,
    seller_id       NUMBER          NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id     NUMBER          REFERENCES categories(category_id) ON DELETE SET NULL,
    title           VARCHAR2(200)   NOT NULL,
    description     CLOB,
    price           NUMBER(10, 2)   NOT NULL CHECK (price > 0),
    stock_quantity  NUMBER          DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url       VARCHAR2(500),
    status          VARCHAR2(20)    DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
    created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP
);
```

---

### ORDERS

```sql
CREATE SEQUENCE orders_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE orders (
    order_id          NUMBER          DEFAULT orders_seq.NEXTVAL PRIMARY KEY,
    customer_id       NUMBER          NOT NULL REFERENCES users(user_id),
    total_amount      NUMBER(12, 2)   NOT NULL,
    status            VARCHAR2(20)    DEFAULT 'pending'
                        CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    delivery_address  VARCHAR2(500)   NOT NULL,
    placed_at         TIMESTAMP       DEFAULT SYSTIMESTAMP,
    updated_at        TIMESTAMP       DEFAULT SYSTIMESTAMP
);
```

---

### ORDER_ITEMS

```sql
CREATE SEQUENCE order_items_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE order_items (
    order_item_id   NUMBER          DEFAULT order_items_seq.NEXTVAL PRIMARY KEY,
    order_id        NUMBER          NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id      NUMBER          NOT NULL REFERENCES products(product_id),
    quantity        NUMBER          NOT NULL CHECK (quantity > 0),
    unit_price      NUMBER(10, 2)   NOT NULL  -- Snapshot of price at time of purchase
);
```

---

### CART_ITEMS

```sql
CREATE SEQUENCE cart_items_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE cart_items (
    cart_item_id    NUMBER          DEFAULT cart_items_seq.NEXTVAL PRIMARY KEY,
    user_id         NUMBER          NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id      NUMBER          NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity        NUMBER          NOT NULL CHECK (quantity > 0),
    added_at        TIMESTAMP       DEFAULT SYSTIMESTAMP,
    UNIQUE (user_id, product_id)    -- Prevent duplicate cart entries
);
```

---

### REVIEWS

```sql
CREATE SEQUENCE reviews_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE reviews (
    review_id       NUMBER          DEFAULT reviews_seq.NEXTVAL PRIMARY KEY,
    product_id      NUMBER          NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    customer_id     NUMBER          NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating          NUMBER(1)       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         VARCHAR2(1000),
    created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP,
    UNIQUE (product_id, customer_id)  -- One review per customer per product
);
```

---

## 5.3 Indexes

```sql
-- Speed up product listing queries
CREATE INDEX idx_products_seller   ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status   ON products(status);

-- Speed up order queries
CREATE INDEX idx_orders_customer   ON orders(customer_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Speed up cart lookups
CREATE INDEX idx_cart_user         ON cart_items(user_id);

-- Speed up review lookups
CREATE INDEX idx_reviews_product   ON reviews(product_id);
```

---

## 5.4 REST API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Any | Get current user profile |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List products (supports `?search=`, `?category=`, `?sort=`, `?page=`) |
| GET | `/api/products/:id` | Public | Get single product detail |
| POST | `/api/products` | Seller | Create new listing |
| PUT | `/api/products/:id` | Seller (owner) | Update product |
| DELETE | `/api/products/:id` | Seller (owner) | Soft-delete product |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Customer | Get all cart items |
| POST | `/api/cart` | Customer | Add item to cart |
| PATCH | `/api/cart/:id` | Customer | Update cart item quantity |
| DELETE | `/api/cart/:id` | Customer | Remove cart item |
| DELETE | `/api/cart` | Customer | Clear entire cart |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Customer | Place order (converts cart to order) |
| GET | `/api/orders` | Customer | List own orders |
| GET | `/api/orders/:id` | Customer/Seller | Get order details |
| PATCH | `/api/orders/:id/status` | Seller | Update order status |
| PATCH | `/api/orders/:id/cancel` | Customer | Cancel order (pending only) |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/:id/status` | Admin | Suspend or activate user |
| GET | `/api/admin/sellers/pending` | Admin | List pending seller applications |
| PATCH | `/api/admin/sellers/:id/approve` | Admin | Approve seller |
| PATCH | `/api/admin/sellers/:id/reject` | Admin | Reject seller |
| GET | `/api/admin/reports` | Admin | Sales and analytics data |

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | List all categories |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |

---

## 5.5 Middleware Stack

```
Request
   |
   v
cors()                  — Allow cross-origin requests from frontend
   |
express.json()          — Parse JSON request body
   |
[Route Handler]
   |
authenticateToken()     — Verify JWT, attach req.user
   |
authorizeRole('Seller') — Check user.role matches required role
   |
Controller Logic
   |
   v
Response (JSON)
```

---

## 5.6 Backend Folder Structure

```
/backend
  /config
    db.config.js        — Oracle connection pool (oracledb.createPool)
    app.config.js       — Port, JWT secret, env vars via dotenv
  /middleware
    auth.middleware.js  — JWT verification → req.user
    role.middleware.js  — Role guard factory: authorizeRole('Admin')
    error.middleware.js — Global error handler → JSON error response
  /models
    User.model.js       — DB query helpers: findByEmail, createUser, ...
    Product.model.js    — findAll, findById, create, update, softDelete
    Order.model.js      — create, findByCustomer, updateStatus
    Cart.model.js       — getByUser, addItem, updateQty, clear
  /controllers
    auth.controller.js
    product.controller.js
    cart.controller.js
    order.controller.js
    admin.controller.js
    category.controller.js
  /routes
    auth.routes.js
    product.routes.js
    cart.routes.js
    order.routes.js
    admin.routes.js
    category.routes.js
  /utils
    helpers.js          — formatResponse(), generateToken(), hashPassword()
    validators.js       — express-validator rule sets per route
  server.js             — Express app setup, route mounting, middleware
```

---

## 5.7 Sample Controller Pattern

```javascript
// product.controller.js
import { ProductModel } from '../models/Product.model.js';
import { formatResponse } from '../utils/helpers.js';

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort = 'created_at', page = 1 } = req.query;
    const products = await ProductModel.findAll({ search, category, sort, page });
    res.json(formatResponse(true, products));
  } catch (err) {
    res.status(500).json(formatResponse(false, null, err.message));
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock_quantity, category_id } = req.body;
    const product = await ProductModel.create({
      seller_id: req.user.id,
      title, description, price, stock_quantity, category_id
    });
    res.status(201).json(formatResponse(true, product));
  } catch (err) {
    res.status(500).json(formatResponse(false, null, err.message));
  }
};
```

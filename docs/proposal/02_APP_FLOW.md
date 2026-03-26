# Application Flow
### E-Commerce Marketplace Management System
**FAST-NUCES Karachi | Section B | SE Project 2024-2025**

---

## 2.1 Customer Journey Flow

### Onboarding
1. Land on **Home Page** → View featured products and categories
2. **Register** → Enter name, email, password, select `Customer` role → Verify email
3. **Login** → Receive JWT token → Redirect to Home Page (authenticated)

### Shopping Flow
4. **Browse** → Search bar or category navigation → Filter by price/rating
5. **Product Page** → View images, description, stock status, seller info, reviews
6. **Add to Cart** → Select quantity → Cart icon updates with item count
7. **Cart Page** → Review items, update quantities, remove items, view total
8. **Checkout** → Enter delivery address → Review order summary → Confirm
9. **Order Confirmation** → Order ID generated → Email notification sent
10. **Order Tracking** → View status updates in "My Orders" dashboard

---

## 2.2 Seller Journey Flow

1. Register as **Seller** → Submit business info → Await Admin approval
2. Login → Access **Seller Dashboard**
3. **Add Product** → Fill title, description, price, quantity, category, upload images
4. **Manage Inventory** → View stock levels, edit quantities, set low-stock threshold
5. **Receive Order Notification** → View order details in Orders panel
6. **Update Order Status** → Mark as `Confirmed → Shipped → Delivered`
7. **View Sales Reports** → Revenue summaries, top products, order analytics

---

## 2.3 Admin Journey Flow

1. Login with admin credentials → Access **Admin Dashboard**
2. **Seller Management** → Review pending seller applications → Approve or Reject
3. **User Management** → View, suspend, or delete customer/seller accounts
4. **Category Management** → Add, edit, or remove product categories
5. **Platform Analytics** → View total sales, active users, revenue trends
6. **Reports** → Export sales and user reports

---

## 2.4 Key Page Transitions

| From Page | Action | To Page |
|-----------|--------|---------|
| Home | Click product card | Product Detail |
| Product Detail | Add to Cart | Cart (side drawer or page) |
| Cart | Proceed to Checkout | Checkout Page |
| Checkout | Place Order | Order Confirmation |
| Order Confirmation | View Orders | My Orders Dashboard |
| Login (Seller) | Successful auth | Seller Dashboard |
| Login (Admin) | Successful auth | Admin Dashboard |

---

## 2.5 Page Inventory

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Product Listing | `/products` | Public |
| Product Detail | `/products/:id` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Cart | `/cart` | Customer |
| Checkout | `/checkout` | Customer |
| Order Confirmation | `/orders/confirm` | Customer |
| My Orders | `/orders` | Customer |
| Seller Dashboard | `/seller/dashboard` | Seller |
| Seller Products | `/seller/products` | Seller |
| Seller Orders | `/seller/orders` | Seller |
| Admin Dashboard | `/admin/dashboard` | Admin |
| Admin Users | `/admin/users` | Admin |
| Admin Sellers | `/admin/sellers` | Admin |
| Admin Reports | `/admin/reports` | Admin |

---

## 2.6 Order Lifecycle

```
Customer Places Order
        |
   Status: PENDING
        |
Seller Reviews & Confirms
        |
  Status: CONFIRMED  <-- Stock deducted here
        |
  Seller Ships Order
        |
   Status: SHIPPED
        |
 Customer Receives Item
        |
  Status: DELIVERED
        |
Customer Can Leave Review
```

> **Cancellation:** Available by Customer only while status is `PENDING`.

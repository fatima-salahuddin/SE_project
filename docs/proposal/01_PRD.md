# Product Requirements Document (PRD)
### E-Commerce Marketplace Management System
**FAST-NUCES Karachi | Section B | SE Project 2024-2025**

---

## 1.1 Product Overview

The E-Commerce Marketplace Management System is a web-based platform designed to connect sellers and customers through a unified, secure, and scalable digital marketplace. It addresses the core operational gaps faced by small and medium enterprises (SMEs) that currently rely on manual or fragmented sales processes.

---

## 1.2 Problem Statement

SMEs struggle with manual inventory tracking, unstructured order processing, poor customer-seller communication, and lack of secure payment infrastructure. Customers face limited product visibility and no reliable order tracking. This system resolves these pain points through centralized automation.

---

## 1.3 Target Users

| User Role | Primary Goals | Key Needs |
|-----------|--------------|-----------|
| **Customer** | Browse, purchase, and track orders | Product search, cart, secure checkout, order history |
| **Seller** | List and manage products, fulfill orders | Inventory control, order notifications, sales reports |
| **Admin** | Oversee platform operations | User management, seller approval, analytics reports |

---

## 1.4 Functional Requirements

### Authentication & User Management
- **FR-01:** Users shall register with email, password, and role selection (Customer/Seller)
- **FR-02:** Login with email/password; JWT-based session management
- **FR-03:** Role-based access control (RBAC) for Customer, Seller, and Admin
- **FR-04:** Password reset via email OTP

### Product Management
- **FR-05:** Sellers can create, update, and delete product listings with images, price, and description
- **FR-06:** Customers can browse products with search and category filters
- **FR-07:** Product detail pages with image gallery, specs, and seller info
- **FR-08:** Category and subcategory management by Admin

### Order & Cart
- **FR-09:** Customers can add items to cart and manage quantities
- **FR-10:** Secure checkout with order summary and payment integration
- **FR-11:** Order status lifecycle: `Pending → Confirmed → Shipped → Delivered`
- **FR-12:** Order history accessible to customers and sellers

### Inventory
- **FR-13:** Real-time stock tracking per product SKU
- **FR-14:** Low-stock alerts to sellers
- **FR-15:** Auto-deduction of stock on order confirmation

### Reviews & Admin
- **FR-16:** Customers can leave star ratings and text reviews after purchase
- **FR-17:** Admin can approve/reject seller accounts
- **FR-18:** Admin dashboard with sales analytics, user counts, and revenue reports

---

## 1.5 Non-Functional Requirements

| Category | Requirement | Target Metric |
|----------|-------------|---------------|
| **Performance** | Page load time | < 3 seconds on standard connection |
| **Scalability** | Concurrent users | Support 500+ simultaneous users |
| **Security** | Data protection | HTTPS, bcrypt password hashing, input sanitization |
| **Availability** | Uptime | 99% during academic deployment |
| **Usability** | Learning curve | New user onboarding < 5 minutes |

---

## 1.6 In Scope

- User registration and authentication
- Product browsing and searching
- Shopping cart functionality
- Order placement and tracking
- Seller product and inventory management
- Admin dashboard and reporting
- Review and rating system

## 1.7 Out of Scope

- Dedicated mobile application
- Real-time delivery tracking
- International shipping logistics
- Advanced AI-based recommendation engine
- Real payment gateway integration

---

## 1.8 Constraints & Assumptions

- Academic project with a **14-week** development timeline
- No real payment gateway — simulated checkout flow
- Desktop-first UI; mobile responsiveness is a stretch goal
- Team of 4 developers with intermediate web development skills
- Oracle Database as mandated by curriculum requirements

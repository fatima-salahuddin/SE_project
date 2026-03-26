# 🛒 E-Commerce Marketplace Management System

A secure, scalable, and role-based web platform connecting customers and sellers in a unified digital marketplace. Built as a final-year Software Engineering project following Agile methodology and a 3-tier architecture.

---

## 👥 Team

| Name | Role |
|---|---|
| **Fatima** | Team Leader & System Architect |
| **Rimsha Amjad** | Quality Assurance & Documentation Lead |

---

## 📌 Project Overview

Many small and medium-sized enterprises (SMEs) in Pakistan lack the resources to build and maintain their own e-commerce presence. This platform addresses that gap by providing an integrated system for:

- Product listing, browsing, and search
- Real-time inventory tracking
- Secure order placement and lifecycle management
- Seller dashboard with sales analytics
- Admin panel with reporting and user management
- Customer reviews and ratings

The system supports three user roles — **Customer**, **Seller**, and **Administrator** — each with tailored access and functionality.

---

## 🏗️ Architecture

The system follows a **3-Tier Architecture**:

```
┌─────────────────────────────┐
│      Presentation Layer      │  HTML, CSS, JavaScript
├─────────────────────────────┤
│      Application Layer       │  Node.js (Business Logic, Auth, APIs)
├─────────────────────────────┤
│        Database Layer        │  Oracle Database
└─────────────────────────────┘
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js |
| Database | Oracle Database |
| Version Control | Git |
| IDE | VS Code, Oracle SQL Developer |
| Diagramming | Papyrus (UML) |
| Mockups | Balsamiq / Figma |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Oracle Database (local or academic instance)
- Oracle SQL Developer
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/ecommerce-marketplace.git
cd ecommerce-marketplace
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Configure the database connection**

Edit `backend/config/db.js` and set your Oracle credentials:
```js
const dbConfig = {
  user: "your_db_user",
  password: "your_db_password",
  connectString: "localhost/XEPDB1"
};
```

**4. Set up the database**

Open Oracle SQL Developer and run the following scripts in order:
```
database/schema.sql   ← creates all tables
database/seed.sql     ← inserts sample data
```

**5. Start the backend server**
```bash
cd backend
node server.js
```

**6. Open the frontend**

Open `frontend/index.html` directly in your browser, or serve it with a static server:
```bash
npx serve frontend
```

The app will be available at `http://localhost:3000`

---

## 📁 Repository Structure

```
ecommerce-marketplace/
│
├── README.md
├── .gitignore
│
├── docs/
│   ├── proposal/           ← All proposal documents (.docx)
│   ├── diagrams/           ← UML diagrams (use case, class, sequence, architecture)
│   ├── mockups/            ← UI mockups (Balsamiq / Figma exports)
│   └── reports/            ← Sprint reports and final report
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── pages/              ← login, register, products, cart, dashboards
│
├── backend/
│   ├── server.js
│   ├── config/             ← Database connection config
│   ├── routes/             ← API route definitions
│   ├── controllers/        ← Business logic handlers
│   └── middleware/         ← Auth and role-based access middleware
│
└── database/
    ├── schema.sql          ← Table creation scripts
    ├── seed.sql            ← Sample/test data
    └── queries/            ← Reusable SQL queries
```

---

## ✅ Core Features

| # | Feature | Actor |
|---|---|---|
| 01 | Product Listing Management | Seller |
| 02 | Product Category & Tag Management | Admin / Seller |
| 03 | Product Search & Filtering | Customer |
| 04 | Product Detail View | Customer |
| 05 | Real-Time Inventory Tracking | Seller |
| 06 | Low-Stock Alert System | Seller |
| 07 | Stock Adjustment & Restock Management | Seller |
| 08 | Shopping Cart Management | Customer |
| 09 | Secure Checkout & Order Placement | Customer |
| 10 | Order Lifecycle Management | All Roles |
| 11 | Order History & Tracking | Customer |
| 12 | Seller Dashboard & Sales Analytics | Seller |
| 13 | Seller Account Application & Approval | Seller / Admin |
| 14 | User Account Management | Admin |
| 15 | Platform Reporting Module | Admin |
| 16 | Dispute & Complaint Management | Admin |
| 17 | Customer Review & Rating System | Customer |
| 18 | Seller Rating & Reputation Tracking | Customer / Admin |
| 19 | Wishlist & Saved Products | Customer |
| 20 | Order & Activity Notification System | Customer / Seller |

---

## 🗓️ Project Timeline

| Phase | Duration |
|---|---|
| Requirements Engineering | Week 1 – 2 |
| System Design (UML & Architecture) | Week 3 – 4 |
| Implementation | Week 5 – 10 |
| Testing & Validation | Week 11 – 13 |
| Documentation & Final Review | Week 14 |

---

## 📋 Development Methodology

This project follows **Agile Software Development** with iterative sprint cycles:

- Requirements refined per sprint
- Incremental feature delivery each sprint
- Continuous integration and testing
- Sprint reviews and retrospectives after each cycle

---

## 📄 Documentation

All project documents are located in the `/docs` folder:

- `docs/proposal/` — Project proposal sections (Overview, Vision, Goals, Features, etc.)
- `docs/diagrams/` — UML Use Case, Class, Sequence, and Activity diagrams
- `docs/mockups/` — UI wireframes for all major screens
- `docs/reports/` — Sprint reports and the final project report

---

## 📚 References

- I. Sommerville, *Software Engineering*, 10th ed. Pearson, 2016.
- R. S. Pressman, *Software Engineering: A Practitioner's Approach*, 8th ed. McGraw-Hill, 2014.

---

## 📝 License

This project is developed for academic purposes at the university level. All rights reserved by the project team.
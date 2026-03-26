# Technology Stack
### E-Commerce Marketplace Management System
**FAST-NUCES Karachi | Section B | SE Project 2024-2025**

---

## 3.1 Full Stack Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | HTML5 | Latest | Semantic page structure |
| **Frontend** | CSS3 + Flexbox/Grid | Latest | Responsive layout & styling |
| **Frontend** | JavaScript (ES6+) | Latest | UI interactivity & DOM manipulation |
| **Backend** | Node.js | 20.x LTS | Server runtime environment |
| **Backend** | Express.js | 4.x | RESTful API framework |
| **Database** | Oracle Database | 19c / 21c | Relational data persistence |
| **DB Driver** | oracledb (npm) | 6.x | Node.js to Oracle connector |
| **Auth** | JSON Web Tokens (JWT) | 9.x | Stateless session management |
| **Auth** | bcryptjs | 2.x | Password hashing |
| **Version Control** | Git + GitHub | Latest | Source control & collaboration |
| **IDE** | VS Code | Latest | Development environment |
| **DB GUI** | Oracle SQL Developer | 23.x | Database management GUI |
| **Design** | Figma / Balsamiq | Latest | UI mockups & wireframes |
| **Testing** | Jest | 29.x | Unit and integration testing |
| **API Testing** | Postman | Latest | REST API testing & documentation |

---

## 3.2 Architecture Pattern

The system implements a **3-Tier MVC Architecture**:

```
┌─────────────────────────────────────┐
│         PRESENTATION TIER           │
│   HTML + CSS + JavaScript (ES6+)    │
│   Fetch API  |  JWT in localStorage │
└────────────────────┬────────────────┘
                     │ HTTP/REST (JSON)
┌────────────────────▼────────────────┐
│          APPLICATION TIER           │
│     Node.js + Express.js            │
│  Routes | Controllers | Middleware  │
│  JWT Auth | bcrypt | Business Logic │
└────────────────────┬────────────────┘
                     │ oracledb driver
┌────────────────────▼────────────────┐
│            DATA TIER                │
│         Oracle Database             │
│  Tables | Sequences | Constraints   │
│  Transactions | Referential Integrity│
└─────────────────────────────────────┘
```

---

## 3.3 Backend Dependencies (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "oracledb": "^6.3.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
```

---

## 3.4 API Communication

- Frontend communicates with backend via **RESTful HTTP** using the browser `Fetch API`
- All responses are **JSON** formatted
- JWT tokens stored in `localStorage`, attached to requests via:
  ```
  Authorization: Bearer <token>
  ```
- CORS configured on Express to allow frontend origin

---

## 3.5 Environment Configuration

```env
# .env (never commit to Git)
PORT=3000
DB_USER=your_oracle_user
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

---

## 3.6 Technology Justification

| Decision | Rationale |
|----------|-----------|
| **Vanilla JS (no framework)** | Aligns with SE curriculum; reduces learning overhead; demonstrates DOM fundamentals |
| **Node.js + Express** | Lightweight, JavaScript end-to-end, large ecosystem, good for REST APIs |
| **Oracle Database** | Curriculum requirement; enterprise-grade ACID compliance; strong constraint enforcement |
| **JWT Auth** | Stateless, scales well, no server-side session storage needed |
| **Git + GitHub** | Industry standard; enables pull requests and code review workflow |

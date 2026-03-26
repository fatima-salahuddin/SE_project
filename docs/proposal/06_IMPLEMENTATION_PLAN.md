# Implementation Plan
### E-Commerce Marketplace Management System
**FAST-NUCES Karachi | Section B | SE Project 2024-2025**

---

## 6.1 Sprint Overview (14 Weeks)

| Sprint | Duration | Phase | Deliverables |
|--------|----------|-------|-------------|
| **S1** | Weeks 1–2 | Requirements Engineering | SRS document, use case diagrams, stakeholder review |
| **S2** | Weeks 3–4 | System Design | ERD, UML diagrams (class, sequence, activity), architecture doc |
| **S3** | Weeks 5–6 | Core Backend | DB schema DDL, user auth API, product CRUD API |
| **S4** | Weeks 7–8 | Core Frontend | Home, product listing, product detail, auth pages |
| **S5** | Weeks 9–10 | Order & Cart | Cart functionality, checkout flow, order management |
| **S6** | Weeks 11–12 | Dashboards | Seller dashboard, admin dashboard, reports, reviews |
| **S7** | Week 13 | Testing & QA | Unit tests, integration tests, UAT, bug fixes |
| **S8** | Week 14 | Final Review | Documentation, demo prep, final submission |

---

## 6.2 Sprint Detail

---

### Sprint 1 — Requirements Engineering (Weeks 1–2)

**Goal:** Establish shared understanding of what to build.

| Task | Owner | Notes |
|------|-------|-------|
| Document functional requirements (FR-01 to FR-18) | Aniqua | Draft in shared Google Doc |
| Draft SRS using IEEE template | Aniqua | Include actors, use cases, constraints |
| Create use case diagrams (draw.io) | Fatima | Actors: Customer, Seller, Admin |
| Define acceptance test criteria per feature | Rimsha | Linked to each FR |
| Finalize data requirements & initial ERD sketch | Aiza | Identify entities and relationships |
| Team review & sign-off on SRS | All | Synchronous meeting required |

**Exit Criteria:** SRS signed off by all team members; use case diagrams complete.

---

### Sprint 2 — System Design (Weeks 3–4)

**Goal:** Detailed blueprint before any code is written.

| Task | Owner | Notes |
|------|-------|-------|
| Architecture decision document (3-tier MVC) | Fatima | Justify each technology choice |
| UML Class Diagrams | Fatima | Map entities to classes with attributes |
| UML Sequence Diagrams (login, place order) | Fatima | Show system interactions |
| UML Activity Diagrams (shopping flow) | Aiza | Key business process flows |
| Finalize ERD; write Oracle DDL scripts | Aiza | Include all constraints and indexes |
| Figma wireframes for all 16 pages | Aniqua | Lo-fi first, then hi-fi |
| Test plan document | Rimsha | Define test types, tools, coverage goals |

**Exit Criteria:** ERD approved, wireframes reviewed, DDL scripts ready to run.

---

### Sprint 3 — Core Backend (Weeks 5–6)

**Goal:** Working authentication and product APIs.

| Task | Owner | Notes |
|------|-------|-------|
| Initialize Node.js + Express project structure | Aiza | Per folder structure in §5.6 |
| Configure Oracle connection pool (oracledb) | Aiza | Use .env for credentials |
| Run DDL scripts; seed test data | Aiza | 3 users (1 each role), 10 products |
| Implement USERS table + auth routes (register/login/me) | Aiza | bcrypt + JWT |
| Implement JWT middleware + role guard middleware | Aiza | `authenticateToken`, `authorizeRole` |
| Implement CATEGORIES CRUD | Aiza | Admin only for write |
| Implement PRODUCTS CRUD | Aiza | Public read, Seller write |
| Write unit tests for auth endpoints | Rimsha | Jest + Supertest |
| API documentation — Postman collection | Fatima | Share via Postman workspace |
| Code review | Fatima | PR required before merge |

**Exit Criteria:** Postman collection passing for all auth and product endpoints.

---

### Sprint 4 — Core Frontend (Weeks 7–8)

**Goal:** Customer-facing pages connected to real API.

| Task | Owner | Notes |
|------|-------|-------|
| Set up frontend folder structure + global.css | Aniqua | CSS variables, reset, typography |
| Build component styles (buttons, cards, forms) | Aniqua | components.css |
| Build Home page (featured products, categories) | Aniqua | Fetch from `/api/products` |
| Build Product Listing page (search, filter, grid) | Aniqua | Debounced search |
| Build Product Detail page (images, info, reviews) | Aniqua | |
| Build Login & Register pages | Aniqua | Forms with validation |
| Integrate auth pages with backend; JWT storage | Fatima | localStorage, redirect on login |
| Navbar: role-aware links, cart icon with count | Fatima | Hide seller/admin links from customers |
| Cross-browser testing (Chrome, Firefox) | Rimsha | Log bugs in GitHub Issues |
| Accessibility audit | Rimsha | Check contrast, semantic HTML, focus states |

**Exit Criteria:** A user can register, login, browse products, and view product detail — end-to-end.

---

### Sprint 5 — Order & Cart (Weeks 9–10)

**Goal:** Complete purchase flow functional.

| Task | Owner | Notes |
|------|-------|-------|
| Implement CART_ITEMS API (get, add, update, remove, clear) | Aiza | |
| Implement ORDERS API (create, list, get, update status, cancel) | Aiza | Stock deduction on order confirm |
| Build Cart page (item list, quantity controls, total) | Aniqua | Real-time total calculation |
| Build Checkout page (address form, order summary, confirm) | Aniqua | |
| Build Order Confirmation page (order ID, details) | Aniqua | |
| Build My Orders page (list with status badges) | Aniqua | |
| End-to-end integration: product → cart → checkout → confirmed | Fatima | |
| Write integration tests for purchase flow | Rimsha | Jest + Supertest |

**Exit Criteria:** Full purchase flow works from product page to confirmed order.

---

### Sprint 6 — Dashboards & Reviews (Weeks 11–12)

**Goal:** Seller and Admin can manage their respective domains.

| Task | Owner | Notes |
|------|-------|-------|
| Implement Seller stats API (sales summary, top products) | Aiza | |
| Implement Admin reports API (revenue, user counts) | Aiza | |
| Implement Admin user management API (list, suspend, activate) | Aiza | |
| Implement Admin seller approval API | Aiza | |
| Build Seller Dashboard (stats cards, recent orders) | Aniqua | |
| Build Seller Products page (CRUD table) | Aniqua | |
| Build Seller Orders page (update status flow) | Aniqua | |
| Build Admin Dashboard (metrics overview) | Aniqua | |
| Build Admin Users & Sellers management pages | Aniqua | |
| Build Admin Reports page | Aniqua | |
| Implement review submission + display on product page | Fatima | |

**Exit Criteria:** Seller can manage orders; Admin can approve sellers and view reports.

---

### Sprint 7 — Testing & QA (Week 13)

**Goal:** Stable, secure, and production-quality build.

| Task | Owner | Notes |
|------|-------|-------|
| Execute all defined test cases from test plan | Rimsha | Log all failures in GitHub Issues |
| Triage and prioritize bugs (Critical/High/Medium/Low) | Fatima | Fix Critical and High in this sprint |
| Security review: SQL injection, broken auth, exposed secrets | Fatima | Use parameterized queries only |
| Test all role-based access controls | Rimsha | Try accessing seller routes as customer, etc. |
| Final responsive design checks (768px, 1024px, 1440px) | Aniqua | |
| UI polish pass: spacing, alignment, color consistency | Aniqua | |
| Performance check: measure page load times | Fatima | Chrome DevTools Network tab |

**Exit Criteria:** All Critical and High bugs resolved; test coverage > 70%; no console errors.

---

### Sprint 8 — Documentation & Submission (Week 14)

**Goal:** Clean codebase, complete documentation, demo-ready.

| Task | Owner | Notes |
|------|-------|-------|
| Finalize project report and testing summary | Rimsha | |
| Write README with local setup instructions | Fatima | Step-by-step for evaluators |
| Update Postman collection to final state | Aiza | Export and commit to repo |
| Clean up GitHub repo (remove debug logs, dead code) | Fatima | |
| Final code review of all modules | Fatima | |
| Demo preparation and rehearsal | All | 15-min demo walkthrough |
| Submit final deliverables | Rimsha | Submit on LMS |

**Exit Criteria:** Repository clean, documentation complete, demo rehearsed.

---

## 6.3 Team Responsibility Matrix (RACI)

| Module | Fatima (Lead/Arch) | Aniqua (Frontend) | Aiza (Backend/DB) | Rimsha (QA/Docs) |
|--------|-------------------|------------------|------------------|-----------------|
| Architecture & Design | **Owner** | Contributor | Contributor | Reviewer |
| Database Schema | Reviewer | — | **Owner** | Reviewer |
| Backend APIs | Reviewer | — | **Owner** | Tester |
| Frontend UI | Reviewer | **Owner** | — | Tester |
| Integration | **Owner** | Contributor | Contributor | Tester |
| Testing & QA | Reviewer | Contributor | Contributor | **Owner** |
| Documentation | Reviewer | Contributor | Contributor | **Owner** |
| Security Review | **Owner** | Reviewer | Contributor | Contributor |

> **O** = Owner (accountable), **C** = Contributor, **R** = Reviewer, **T** = Tester

---

## 6.4 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Oracle DB setup complexity | High | High | Set up shared dev Oracle instance in Week 1; document connection steps in README |
| Scope creep (feature additions) | Medium | Medium | Strict backlog management; defer features to stretch goals list |
| Team member unavailability | Low | High | Cross-train on adjacent modules; all code reviewed by 2+ members |
| Integration failures between layers | Medium | High | Weekly integration testing from Sprint 4 onwards |
| Security vulnerabilities | Medium | High | Security review in Sprint 7; parameterized queries enforced |
| Late-sprint bugs blocking demo | Medium | High | Reserve full Sprint 7 for testing; no new features after Sprint 6 |

---

## 6.5 Definition of Done

A feature is considered **Done** when all of the following are true:

- [ ] Implemented and matches the functional requirement specification
- [ ] Unit tests written and passing (where applicable)
- [ ] Code reviewed and merged to `main` via pull request (at least 1 reviewer approval)
- [ ] Postman collection updated for any new API endpoint
- [ ] UI tested in Chrome and Firefox — no console errors
- [ ] No hardcoded credentials or secrets in code
- [ ] Documentation updated if behavior, schema, or API contract changed

---

## 6.6 Git Workflow

```
main
  |
  |-- develop          ← Integration branch
        |
        |-- feature/auth         ← Sprint task branches
        |-- feature/product-crud
        |-- feature/cart
        |-- bugfix/order-status
```

**Commit message format:**
```
feat(auth): add JWT middleware for protected routes
fix(cart): correct total calculation on quantity update
docs(readme): add Oracle setup instructions
test(products): add unit tests for product CRUD
```

**PR Rules:**
- All PRs target `develop`
- At least 1 approval required before merge
- No merge with failing tests
- `main` is updated only at sprint end (stable milestone)

---

## 6.7 Stretch Goals (Post-Submission)

If time permits after Sprint 7:

- Email notifications (Nodemailer) for order status changes
- Image upload via Multer (store product images server-side)
- Mobile-responsive CSS improvements
- Pagination on product listing and order history
- Product wishlist feature
- Seller analytics chart (Chart.js)

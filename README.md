# 🌿 Green Fresh App – Full-Stack Organic Grocery Platform

A modern, responsive, full-stack online grocery shopping platform built with **React (Vite) + Tailwind CSS + Node.js + Express.js + MongoDB**.

Inspired by premium Dribbble designs (**Natura Market**, **GREENAURA**, **Freshbazar**, and **FreshCart**), Green Fresh provides a farm-to-table shopping experience with live freshness scores, real-time cart drawer, cold-chain shipment tracking, simulated test payments (UPI/Card/COD), and a comprehensive Admin Dashboard.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Aesthetic Farm-Fresh UI**: Clean emerald green and off-white palette with floating badges (`100% Natural`, `Same Day Delivery`, `4.9/5 Rating`).
- **Live Search & Autocomplete**: Instant search by vegetable, fruit, grocery, or partner farm name.
- **Product Catalog & Filters**:
  - Filter by category: *Fresh Fruits, Fresh Vegetables, Organic Products, Dairy, Fresh Juices, Daily Groceries*.
  - Sort by *Featured, Freshness Score, Rating, Price Low-to-High, Price High-to-Low*.
  - 100% Organic filter and price slider.
- **Rich Product Details**:
  - High-res imagery with *Freshness Score (e.g. 98%)*, harvest date, and farm origin.
  - Interactive customer review system with star ratings.
  - Related items carousel.
- **Freshbazar Slide-Over Cart Drawer**:
  - Live quantity adjustment (`+` / `-` / remove).
  - Free delivery threshold progress bar with celebratory unlock.
- **Coupons & Discounts**:
  - Apply promo codes (e.g., `GREEN10` for 10% off, `WELCOME20` for 20% off).
- **Checkout & Multi-Mode Payment**:
  - Delivery slot picker (Express 45-min, Morning, Evening).
  - Payment modes: **UPI (QR code / VPA)**, **Credit/Debit Card**, and **Cash on Delivery**.
- **Interactive Shipment Tracking**:
  - Real-time 5-step status: `Order Placed` ➔ `Packed at Farm` ➔ `Cold-Chain Transit` ➔ `Out For Delivery` ➔ `Delivered Fresh`.
  - Electric vehicle cold-chain temperature telemetry (4.2°C).
  - Order cancellation support before dispatch.
- **Customer Account & Saved Addresses**:
  - Manage contact info, view order invoices, and save multiple delivery addresses.

### 🛡️ Admin Dashboard (`/admin`)
- **Executive KPI Cards**:
  - Total Gross Revenue with weekly growth trend (`↑ 18.2%`).
  - Total Orders, Catalog Products, and Active Customers.
- **Interactive Analytics**:
  - 7-day revenue trend bar chart.
  - Category sales distribution breakdown.
- **Product Management (Full CRUD)**:
  - Add new products with image preview, organic tag, stock, harvest date, and freshness score.
  - Edit existing produce items.
  - Delete items from catalog.
- **Order Pipeline Control**:
  - Filter orders by status (*Placed, Packed, Shipped, Out for Delivery, Delivered, Cancelled*).
  - Update status dropdown in real-time.
- **Customer Directory**:
  - View registered user accounts and roles.

---

## 🚀 Quick Start Guide (VS Code)

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
> The backend will start on **`http://localhost:5000`**.  
> If no MongoDB Atlas URI is set, the backend seamlessly runs with its resilient in-memory seed store so you can test everything immediately without needing a database daemon running!

### 2. Start the Frontend Client
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
> The frontend will launch at **`http://localhost:5173`**.

---

## 🔑 Demo Credentials

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@greenfresh.com` | `admin123` | Full access to Admin Dashboard (`/admin`), inventory CRUD, order status updates |
| **Customer** | `customer@greenfresh.com` | `user123` | Cart, wishlist, checkout, orders, address book |

> *Tip: On the `/login` page, you can click the **Customer Demo** or **Admin Demo** buttons to fill the form in one click!*

---

## 🗄️ Connecting MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Copy your connection URI (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/green_fresh_app?retryWrites=true&w=majority`).
3. Open `backend/.env` and replace:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   ```
4. Restart the backend: `npm run dev`. The system will automatically seed all categories, products, and default accounts into your database.

---

## 📁 Project Architecture

```
green-fresh-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & memory fallback store
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── productController.js  # Products CRUD, search, reviews
│   │   ├── orderController.js    # Order placement, tracking, cancellation
│   │   └── adminController.js    # KPIs, dashboard analytics, order status
│   ├── middleware/
│   │   └── auth.js               # JWT verification & Admin guards
│   ├── models/
│   │   ├── User.js               # Customer & Admin schemas
│   │   ├── Product.js            # Products, freshness scores, reviews
│   │   ├── Category.js           # Groceries & Produce categories
│   │   └── Order.js              # Items, payment, delivery timeline
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── seedData.js               # Rich realistic produce with Unsplash photos
│   ├── server.js                 # Express server & API routes
│   └── .env                      # Environment config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, live search autocomplete, cart trigger
│   │   │   ├── Footer.jsx        # Brand pillars, newsletter, payment badges
│   │   │   ├── ProductCard.jsx   # Natura Market / GREENAURA styled product card
│   │   │   ├── CartDrawer.jsx    # Freshbazar slide-over shopping cart
│   │   │   └── Toast.jsx         # Action notifications
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User login session state
│   │   │   └── CartContext.jsx   # Cart, wishlist, coupons, free delivery progress
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero, trust badges, categories, bestsellers, deals
│   │   │   ├── ProductsPage.jsx  # Catalog with price range, sorting, organic toggle
│   │   │   ├── ProductDetailPage.jsx # Harvest details, reviews & related produce
│   │   │   ├── CategoryPage.jsx  # Dedicated category landings
│   │   │   ├── CartPage.jsx      # Full shopping cart & coupon redemption
│   │   │   ├── CheckoutPage.jsx  # Addresses, delivery slots & payment methods
│   │   │   ├── OrderSuccessPage.jsx # Confetti celebration & delivery estimate
│   │   │   ├── OrderTrackingPage.jsx # 5-step live shipment tracker
│   │   │   ├── MyOrdersPage.jsx  # Order history & invoice views
│   │   │   ├── UserProfilePage.jsx # Profile edit & address book
│   │   │   ├── AboutPage.jsx     # Our organic farms story
│   │   │   ├── ContactPage.jsx   # Support form & FAQ accordion
│   │   │   ├── LoginPage.jsx     # Login with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx  # New account registration
│   │   │   └── AdminDashboardPage.jsx # FreshCart styled KPIs, charts, CRUD & orders
│   │   ├── services/
│   │   │   └── api.js            # Centralized API client
│   │   ├── styles/
│   │   │   └── index.css         # Tailwind & custom animations
│   │   ├── App.jsx               # React Router config
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── package.json
```

---

## 🛡️ License & Credits
Built for modern full-stack portfolio & production demonstration.
Green Fresh App is licensed under the MIT License.


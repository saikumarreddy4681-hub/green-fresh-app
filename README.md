# 🌿 GreenFresh – Farm to Doorstep (Organic Grocery E-Commerce Platform)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-emerald.svg)](https://www.mongodb.com/)

A modern, high-performance, full-stack organic grocery shopping web application built with **React (Vite) + Tailwind CSS + Node.js + Express.js + MongoDB**.

GreenFresh delivers a direct farm-to-table shopping experience strictly featuring **3 core grocery categories** with 55 carefully curated, organic products, high-fidelity local vector imagery, responsive slide-over cart, wishlist, checkout with multiple payment methods, order tracking, and a 12-section administrative control panel.

---

## 📋 Table of Contents
- [Product Categories & Catalog](#-product-categories--catalog)
- [Key Features](#-key-features)
- [Default Login Credentials](#-default-login-credentials)
- [Quick Start Guide](#-quick-start-guide)
- [MongoDB Atlas Integration](#-mongodb-atlas-integration)
- [Connecting to GitHub](#-connecting-to-github)
- [API Reference](#-api-reference)
- [Troubleshooting & Port Conflicts](#-troubleshooting--port-conflicts)

---

## 🧺 Product Categories & Catalog

The platform strictly curates **3 essential grocery categories** (55 total products):

### 1. Fresh Fruits (20 Items)
- **Apples** (Kinnaur Royal Gala Red Apples)
- **Bananas** (Robusta Naturally Ripened Bananas)
- **Mangoes** (Ratnagiri Alphonso GI Mangoes)
- **Oranges** (Nagpur Sweet Santra Oranges)
- **Grapes** (Sonaka Seedless Green Grapes)
- **Papaya** (Red Lady Sweet Farm Papaya)
- **Watermelon** (Kiran Striped Juicy Watermelon)
- **Pomegranate** (Bhagwa Ruby Red Pomegranate)
- **Guava** (Allahabad Safeda Pink Guava)
- **Kiwi** (Zespri Green Premium Kiwi)
- **Pineapple** (Queen Sweet Golden Pineapple)
- **Strawberries** (Mahabaleshwar Winter Strawberries)
- **Dragon Fruit** (Pink Pitaya Dragon Fruit)
- **Sweet Lime** (Fresh Mosambi Sweet Lime)
- **Jackfruit** (Tender Sweet Kathal Pods)
- **Sapota** (Dahanu Caramel Sweet Sapota)
- **Chikoo** (Cricket Ball Granular Chikoo)
- **Pear** (Kashmir Nakh Green Pear)
- **Muskmelon** (Kharbuja Honey Sweet Muskmelon)
- **Lemon** (Kagzi Juicy Yellow Lemons)

### 2. Fresh Vegetables (20 Items)
- **Tomatoes** (Country Desi Vine Tomatoes)
- **Potatoes** (Pahari Jyoti Golden Potatoes)
- **Onions** (Nashik Red Premium Onions)
- **Carrots** (Ooty Sweet Orange Carrots)
- **Cucumbers** (Crisp English Salad Cucumbers)
- **Spinach** (Tender Baby Palak Leaves)
- **Broccoli** (Fresh Green Crown Broccoli)
- **Cauliflower** (Snowball White Cauliflower)
- **Cabbage** (Crisp Round Green Cabbage)
- **Green Beans** (French Tender Stringless Beans)
- **Brinjal** (Baingan Purple Round Eggplant)
- **Capsicum** (Crisp Green Bell Peppers)
- **Green Chillies** (Spicy Fresh Hari Mirch)
- **Beetroot** (Earthy Deep Red Beetroot)
- **Radish** (Mooli White Crunchy Radish)
- **Pumpkin** (Kaddu Golden Sweet Pumpkin)
- **Bottle Gourd** (Lauki Tender Bottle Gourd)
- **Bitter Gourd** (Karela Farm Bitter Gourd)
- **Drumstick** (Sahjan Tender Moringa Drumsticks)
- **Coriander Leaves** (Fragrant Fresh Dhaniya Leaves)

### 3. Milk & Dairy (15 Items)
- **Fresh Cow Milk** (Pasteurised Whole Farm Cow Milk, 1 L)
- **Buffalo Milk** (High Fat Pure Murrah Buffalo Milk, 1 L)
- **Toned Milk** (Daily Toned Milk 3.0% Fat, 1 L)
- **Full Cream Milk** (Rich Whole Milk 6.0% Fat, 1 L)
- **Organic Milk** (Certified Grass-Fed Organic Milk, 1 L)
- **Curd** (Thick Desi Dahi Set Curd, 500g)
- **Paneer** (Soft Artisanal Malai Paneer, 200g)
- **Butter** (Slow-Churned Desi White Makhan, 250g)
- **Ghee** (Bilona Churned A2 Desi Cow Ghee, 500ml)
- **Cheese** (Farmhouse Cheddar Aged Cheese, 200g)
- **Buttermilk** (Masala Spiced Refreshing Chaas, 500ml)
- **Greek Yogurt** (Triple-Strained Natural Yogurt, 400g)
- **Flavoured Milk** (Badam Kesar Saffron Farm Milk, 200ml)
- **Fresh Cream** (Rich Malai Cooking Cream, 250ml)
- **Skimmed Milk** (Zero Fat Diet Milk 0.5% Fat, 1 L)

---

## 🌟 Key Features

- **No Broken or Mismatched Images**: Every produce item is backed by a dedicated local SVG asset inside `frontend/public/images/` designed in modern studio style (no external network dependencies or unrelated images).
- **Dual-Mode Resilient Architecture**: Backend operates seamlessly with MongoDB Atlas OR self-healing in-memory fallback. The website never crashes even if MongoDB is offline.
- **Dynamic Category Navigation**: Quick tabs for `/fruits`, `/vegetables`, and `/milk-dairy`.
- **Slide-Over Cart & Free Shipping Bar**: Real-time quantity adjustments, free delivery threshold calculation (Free over ₹350, ₹40 under ₹350).
- **Multi-Option Checkout**: Simulated instant demo checkout supporting **UPI (QR code/VPA)**, **Credit/Debit Card**, and **Cash on Delivery**.
- **Wishlist Support**: Save favorite items with persistent local storage and 1-click "Move All to Cart".
- **Admin Dashboard (`/admin/dashboard`)**: Full 12-section management dashboard including KPIs, Product CRUD, low-stock alerts, customer overview, and order status transitions.

---

## 🔐 Default Login Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Primary Admin** | `admin@greenfresh.com` | `admin123` | Full Admin Dashboard (`/admin/dashboard`) |
| **Personal Admin** | `saikumarreddy4681@gmail.com` | `admin123` | Full Admin Dashboard (`/admin/dashboard`) |
| **Demo Customer** | `customer@greenfresh.com` | `customer123` | Storefront Shopping & Order Tracking |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18 or later installed
- npm or pnpm installed

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Run Both Servers Concurrently
From the root project directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🍃 MongoDB Atlas Integration

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Database User and allow your IP address in **Network Access** (`0.0.0.0/0` for universal dev access).
3. Open `backend/.env` and update `MONGODB_URI`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/green_fresh_app?retryWrites=true&w=majority
JWT_SECRET=green_fresh_secret_key_2026_super_secure
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
4. Restart the backend. GreenFresh will automatically connect, synchronize the schema, and auto-seed all 55 products and categories!

---

## 🐙 Connecting to GitHub

The repository is connected to `https://github.com/saikumarreddy4681-hub/green-fresh-app.git`.

Push project changes from the project root:

```powershell
git push origin main
```

---

## 🚀 Deploy to Render (Free)

The root `render.yaml` configures one free Node web service that builds and serves both the API and frontend.

1. Sign in to [Render](https://dashboard.render.com/) and connect your GitHub account.
2. Select **New** → **Blueprint**, choose `green-fresh-app`, and apply the `render.yaml` configuration.
3. Enter your MongoDB Atlas connection string as `MONGODB_URI` and set a strong `ADMIN_PASSWORD` when prompted. Render generates `JWT_SECRET`.
4. After the deploy succeeds, open the service URL and check `/api/health`.

Render's free web services can spin down when idle. MongoDB Atlas keeps application data persistent across service restarts.

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | No |
| `GET` | `/api/products` | Retrieve products (with filtering, category, sorting) | No |
| `GET` | `/api/products/:id` | Product detail by ID | No |
| `GET` | `/api/categories` | Retrieve 3 grocery categories | No |
| `POST` | `/api/auth/register` | Customer sign-up | No |
| `POST` | `/api/auth/login` | Sign-in (Customer or Admin) | No |
| `GET` | `/api/orders/my-orders` | Current customer's order history | Yes |
| `POST` | `/api/orders` | Place a new grocery order | Yes |
| `GET` | `/api/admin/stats` | Executive KPI metrics & chart data | Yes (Admin) |
| `POST` | `/api/products` | Add new produce item | Yes (Admin) |
| `PUT` | `/api/products/:id` | Edit produce item | Yes (Admin) |
| `DELETE` | `/api/products/:id` | Remove produce item | Yes (Admin) |

---

## 🛠️ Troubleshooting & Port Conflicts

If port `5000` or `5173` ever shows `EADDRINUSE: address already in use`:

```powershell
# Clean all orphaned node processes on ports 5000 and 5173
npm run clean-ports

# Start the servers fresh
npm run dev
```

---

Built with 💚 for fresh organic living.

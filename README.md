# Sai Teja Traders — Steel & Cement B2B E-Commerce Platform

<div align="center">

![Sai Teja Traders](https://img.shields.io/badge/Platform-B2B%20E--Commerce-teal?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN-informational?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Your Trusted Steel & Cement Supply Partner**

</div>

---

## Overview

**Sai Teja Traders** is a full-stack B2B e-commerce platform for industrial steel and cement supply.
Customers can browse a live-priced product catalogue, place bulk orders, generate GST-compliant invoices, and track dispatches in real time. Admins manage stock, pricing, orders, and invoices from a centralized dashboard.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18 (Vite), Tailwind CSS           |
| Backend   | Node.js, Express 5                      |
| Database  | MongoDB (Mongoose ODM)                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs           |
| Payments  | Razorpay (simulated in dev mode)        |
| PDF       | html2canvas + jsPDF                     |
| Hosting   | Render (backend) + Vercel (frontend)    |

---

## Project Structure

```
term4pro/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth + error handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # GST calculator, notifications
│   │   ├── seeder.js       # Database seed script
│   │   └── server.js       # Express app entry point
│   ├── .env                # Backend environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── PriceTicker.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── TrackingTimeline.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── InvoiceModal.jsx
│   │   │   └── ProductImage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── TrackingPage.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AuthPage.jsx
│   │   ├── services/
│   │   │   └── api.js      # Axios client
│   │   ├── App.jsx          # Root SPA router
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── index.html              # Standalone CDN prototype (no Node needed)
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas URI)

### 1. Clone
```bash
git clone https://github.com/your-username/sai-teja-traders.git
cd sai-teja-traders
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` in `/backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/saitejatraders
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed the database:
```bash
node src/seeder.js
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

---

## Demo Credentials (after running seeder)

| Role     | Email                           | Password      |
|----------|---------------------------------|---------------|
| Admin    | admin@saitejatraders.com        | `admin123`    |
| Customer | customer@saitejatraders.com     | `customer123` |

---

## Features

### Customer Portal
- 🔍 Browse & filter steel/cement catalogue with live prices
- 🛒 Cart with quantity management and GST preview
- 💳 Checkout with Razorpay, UPI, NEFT, or Credit Account
- 📦 Real-time order tracking timeline
- 🧾 Downloadable GST-compliant PDF invoices
- 👤 Customer dashboard with full order history

### Admin Console
- 📊 Analytics dashboard (Revenue, Orders, Low-Stock alerts)
- ⚙️ Live price controller — updates propagate system-wide instantly
- 🏭 Inventory manager with restocking tool
- 📋 Order processing with delivery status pipeline
- 🖨️ Invoice generation per order

### Platform
- 🔐 JWT authentication with role-based access (admin/customer)
- 📡 Live price ticker on all inner pages
- 💬 Toast notification system
- 📱 Fully responsive (mobile, tablet, desktop)

---

## Color Palette

| Token   | Hex       | Usage                        |
|---------|-----------|------------------------------|
| Navy    | `#1F3147` | Primary text, headers        |
| Teal    | `#008C95` | CTAs, accents, active states |
| Gold    | `#D4A017` | Highlights, badges           |
| Light   | `#F8F8F8` | Page background              |

---

## API Reference

| Method | Endpoint                    | Auth     | Description               |
|--------|-----------------------------|----------|---------------------------|
| POST   | `/api/auth/register`        | None     | Register new user         |
| POST   | `/api/auth/login`           | None     | Login, returns JWT        |
| GET    | `/api/products`             | None     | List all products         |
| PUT    | `/api/products/:id/stock`   | Admin    | Update stock levels       |
| GET    | `/api/orders`               | Customer | Get own orders            |
| POST   | `/api/orders`               | Customer | Place new order           |
| PUT    | `/api/orders/:id/status`    | Admin    | Update delivery status    |
| GET    | `/api/prices`               | None     | Get live price index      |
| PUT    | `/api/prices/:category`     | Admin    | Update commodity price    |
| GET    | `/api/invoices/:orderId`    | Customer | Get invoice for order     |

---

## Standalone Prototype

No Node.js? Open `index.html` directly in any browser — it runs a complete interactive demo using React + Tailwind via CDN with full localStorage persistence.

---

## License

MIT © 2026 Sai Teja Traders

# NexusMarket – Frontend

React frontend for the Multivendor Ecommerce platform with AI-powered features.

## Stack
- **React 18** + React Router v6
- **Pure CSS** (no Tailwind) – custom design system with CSS variables
- **Axios** for API calls
- **Lazy loading** for all pages

## Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero, categories, AI recommendations, features |
| `/products` | Products | Listing with filters, sort, search, pagination |
| `/products/:id` | ProductDetail | Images, specs, reviews with BERT fake detection |
| `/cart` | Cart | Cart items, quantity, order summary |
| `/login` | Login | JWT authentication |
| `/register` | Register | New account creation |
| `/vendor/dashboard` | VendorDashboard | Stats, orders, products, AI insights |

## AI Integration
- **Recommendations**: `GET /api/ai/recommendations/:userId/` – SVD + TF-IDF hybrid
- **Fake Review Detector**: `POST /api/ai/review-detect/` with `{ text: "..." }`
- When API is offline, both fall back to offline mock data gracefully

## Setup

```bash
cd frontend
cp .env.example .env
# Edit REACT_APP_API_URL to point to your Django server

npm install
npm start
```

## Django API expected endpoints

```
/api/products/           GET, POST
/api/products/:id/       GET, PUT, DELETE
/api/vendors/            GET
/api/vendors/:id/        GET
/api/orders/             GET, POST
/api/cart/               GET
/api/reviews/            GET, POST
/api/auth/login/         POST  → { access, refresh }
/api/auth/register/      POST
/api/auth/me/            GET
/api/ai/recommendations/:userId/   GET
/api/ai/review-detect/             POST { text }
```

## Folder Structure

```
src/
├── components/
│   ├── layout/     Navbar, Footer
│   ├── product/    ProductCard
│   └── ai/         FakeReviewBadge, Recommendations
├── context/        CartContext, AuthContext
├── pages/
│   ├── Home/
│   ├── Products/
│   ├── ProductDetail/
│   ├── Cart/
│   ├── Auth/       Login, Register
│   └── Vendor/     VendorDashboard
├── services/
│   └── api.js      All API calls (axios)
└── index.css       Global design system + tokens
```

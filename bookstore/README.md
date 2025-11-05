# Bookstore (Customer-Facing Only) — Local, Static Data

A lightweight local full-stack online bookstore. Customer-only features: browse, search, filter/sort, view book details, add to cart, and mock checkout that saves an order to a JSON file. No auth, no real payments.

## Tech Stack
- Frontend: React (Vite) + Bootstrap
- Backend: Node.js + Express
- Data storage: Static JSON files in `backend/data/`

## Project Structure
```
bookstore/
  backend/
    server.js
    package.json
    data/
      books.json
      orders.json
    routes/
      books.js
      orders.js
  frontend/
    package.json
    vite.config.js
    index.html
    src/
      main.jsx
      App.jsx
      index.css
      utils/api.js
      components/
        Header.jsx
        Footer.jsx
        BookCard.jsx
        CategoryList.jsx
        SearchBar.jsx
      pages/
        Home.jsx
        Books.jsx
        BookDetails.jsx
        Cart.jsx
        Checkout.jsx
```

## Run Instructions

### 1) Backend
```
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:4000`.

### 2) Frontend
Open a new terminal:
```
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173` (proxy forwards `/api` to backend).

## API Endpoints
- GET `/api/books` — query params: `category`, `search`, `minPrice`, `maxPrice`, `inStock`, `sort` (price_asc | price_desc | newest | alpha), `page`, `pageSize`.
- GET `/api/books/:id`
- POST `/api/orders` — creates an order, persists in `backend/data/orders.json` and returns `{ orderId, status, order, warnings }`.

## Notes
- Cart persists in `localStorage`.
- Images use external URLs for simplicity, but you can switch to local images via `frontend/public/images` and update `coverImage` paths in `books.json`.
- This app is for local development/demo only.



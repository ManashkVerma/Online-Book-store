import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (book, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.bookId === book.id)
      if (existing) {
        return prev.map((it) => it.bookId === book.id ? { ...it, quantity: Math.min(it.quantity + quantity, book.stock) } : it)
      }
      return [...prev, { bookId: book.id, title: book.title, price: book.price, quantity: Math.min(quantity, book.stock), stock: book.stock }]
    })
  }
  const removeFromCart = (bookId) => setItems((prev) => prev.filter((it) => it.bookId !== bookId))
  const updateQty = (bookId, qty, stock = 99) => setItems((prev) => prev.map((it) => it.bookId === bookId ? { ...it, quantity: Math.max(1, Math.min(qty, stock)) } : it))
  const clearCart = () => setItems([])
  const count = items.reduce((sum, it) => sum + it.quantity, 0)
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQty, clearCart, count, subtotal }), [items, count, subtotal])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default function App() {
  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="container my-4 flex-fill">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}



import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../App.jsx'
import { createOrder } from '../utils/api.js'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }
    try {
      setLoading(true)
      setError('')
      const payload = {
        customer: { name: form.name, email: form.email, address: form.address, phone: form.phone },
        items: items.map((i) => ({ bookId: i.bookId, title: i.title, price: i.price, quantity: i.quantity })),
        subtotal: Number(subtotal.toFixed(2)),
        shipping: 0,
        total: Number(subtotal.toFixed(2)),
        notes: 'Mock order'
      }
      const data = await createOrder(payload)
      setConfirmation(data)
      clearCart()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmation) {
    return (
      <div className="card p-4">
        <h3>Order Confirmed</h3>
        <p>Your order <strong>{confirmation.orderId}</strong> has been placed.</p>
        {confirmation.warnings?.length > 0 && (
          <div className="alert alert-warning">
            <ul className="mb-0">
              {confirmation.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
            </ul>
          </div>
        )}
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-lg-7">
        <h3 className="mb-3">Checkout</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input required className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input required type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea required className="form-control" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone (optional)</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button disabled={loading} className="btn btn-primary">{loading ? 'Placing…' : 'Place Order'}</button>
        </form>
      </div>
      <div className="col-lg-5">
        <div className="card p-3">
          <h5>Order Summary</h5>
          <ul className="list-group mb-3">
              {items.map((it) => (
              <li key={it.bookId} className="list-group-item d-flex justify-content-between">
                <span>{it.title} × {it.quantity}</span>
                <span>${(it.price * it.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="d-flex justify-content-between"><span>Shipping</span><span>$0.00</span></div>
          <hr />
          <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  )
}



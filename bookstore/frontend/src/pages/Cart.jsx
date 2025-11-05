import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../App.jsx'

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useCart()
  const navigate = useNavigate()
  return (
    <div>
      <h3 className="mb-3">Your Cart</h3>
      {items.length === 0 ? (
        <div className="alert alert-info">Your cart is empty. <Link to="/books">Browse books</Link>.</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <ul className="list-group">
              {items.map((it) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={it.bookId}>
                  <div>
                    <div className="fw-semibold">{it.title}</div>
                    <div className="text-muted">${it.price.toFixed(2)} each</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input type="number" min={1} max={it.stock || 99} className="form-control" style={{width: 90}} value={it.quantity} onChange={(e) => updateQty(it.bookId, Number(e.target.value), it.stock)} />
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(it.bookId)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4">
            <div className="card p-3">
              <h5>Summary</h5>
              <div className="d-flex justify-content-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between"><span>Shipping</span><span>$0.00</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
              <button className="btn btn-primary w-100 mt-3" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



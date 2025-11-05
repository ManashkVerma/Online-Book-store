import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../App.jsx'

export default function BookCard({ book }) {
  const { addToCart } = useCart()
  return (
    <div className="card h-100 shadow-sm">
      <img src={book.coverImage} className="card-img-top book-cover" alt={book.title} style={{height: 220}} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }} />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1">{book.title}</h6>
        <div className="text-muted mb-2" style={{fontSize: '0.9rem'}}>{book.author}</div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold">${book.price.toFixed(2)}</span>
          <div>
            <Link to={`/books/${book.id}`} className="btn btn-sm btn-outline-secondary me-2">Details</Link>
            <button onClick={() => addToCart(book, 1)} className="btn btn-sm btn-primary" disabled={book.stock <= 0}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}



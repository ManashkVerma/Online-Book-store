import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchBookById } from '../utils/api.js'
import { useCart } from '../App.jsx'
 

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBookById(id)
        setBook(data)
      } catch (e) {
        setError('Book not found')
      }
    })()
  }, [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!book) return <div className="alert alert-info">Loading…</div>

  return (
    <div className="row">
      <div className="col-md-4">
        <img src={book.coverImage} alt={book.title} className="img-fluid rounded shadow-sm" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }} />
      </div>
      <div className="col-md-8">
        <h3>{book.title}</h3>
        <div className="text-muted mb-2">by {book.author}</div>
        <div className="mb-3"><span className="badge bg-secondary me-2">{book.category}</span> Published: {new Date(book.publishedDate).toLocaleDateString()}</div>
        <p>{book.description}</p>
        <div className="d-flex align-items-center gap-3 mt-3">
          <h4 className="mb-0">${book.price.toFixed(2)}</h4>
          <span className={book.stock > 0 ? 'text-success' : 'text-danger'}>{book.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
        </div>
        <div className="d-flex align-items-center gap-2 mt-3">
          <input type="number" className="form-control" style={{maxWidth: 120}} min={1} max={book.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <button className="btn btn-primary" disabled={book.stock <= 0} onClick={() => addToCart(book, qty)}>Add to Cart</button>
          {book.sampleAvailable && <button className="btn btn-outline-secondary" onClick={() => addToCart(book, 1)}>Buy Sample</button>}
        </div>
      </div>
    </div>
  )
}



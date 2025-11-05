import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchBooks } from '../utils/api.js'
import BookCard from '../components/BookCard.jsx'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const { books } = await fetchBooks({ pageSize: 12, sort: 'newest' })
        setFeatured(books)
      } catch (e) {
        setError('Failed to load featured books.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const categories = useMemo(() => ['Technical', 'Fiction', 'Self-Help', 'Business'], [])

  return (
    <div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Welcome to Bookstore</h1>
          <p className="col-md-8 fs-5">Browse categories, discover books, add to cart, and place a mock order.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/books')}>Browse Books</button>
        </div>
      </div>

      <h4 className="mb-3">Categories</h4>
      <div className="row g-3 mb-4">
        {categories.map((c) => (
          <div className="col-6 col-md-3" key={c}>
            <Link to={`/books?category=${encodeURIComponent(c)}`} className="text-decoration-none">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <div className="fw-bold">{c}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <h4 className="mb-3">Featured</h4>
      {loading && <div className="alert alert-info">Loading…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {featured.map((b) => (
          <div key={b.id} className="col-6 col-md-3">
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </div>
  )
}



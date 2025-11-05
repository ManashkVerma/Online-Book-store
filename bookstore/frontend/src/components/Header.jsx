import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../App.jsx'

export default function Header() {
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    navigate(`/books?search=${encodeURIComponent(query)}`)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Bookstore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample" aria-controls="navbarsExample" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsExample">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/books">Books</Link></li>
          </ul>
          <form className="d-flex me-3" role="search" onSubmit={onSubmit}>
            <input className="form-control" type="search" placeholder="Search title or author" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
          <Link to="/cart" className="btn btn-outline-light">Cart ({count})</Link>
        </div>
      </div>
    </nav>
  )
}



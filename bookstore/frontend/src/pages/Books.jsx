import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchBooks } from '../utils/api.js'
import BookCard from '../components/BookCard.jsx'
import CategoryList from '../components/CategoryList.jsx'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Books() {
  const q = useQuery()
  const [books, setBooks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState(q.get('search') || '')
  const [selectedCats, setSelectedCats] = useState(() => q.get('category') ? [q.get('category')] : [])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState('')

  const categories = ['Technical', 'Fiction', 'Self-Help', 'Business']

  const fetchList = async () => {
    try {
      setLoading(true)
      const params = {
        search: searchTerm || undefined,
        category: selectedCats.join(',') || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        inStock: inStock || undefined,
        sort: sort || undefined,
        page: 1,
        pageSize: 24,
      }
      const { books, total } = await fetchBooks(params)
      setBooks(books)
      setTotal(total)
      setError('')
    } catch (e) {
      setError('Failed to load books.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchList() }, [])

  const toggleCat = (c) => {
    setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

  return (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card p-3 mb-3">
          <h6 className="mb-3">Search</h6>
          <input className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Title or author" />
        </div>
        <div className="card p-3 mb-3">
          <h6 className="mb-3">Categories</h6>
          <CategoryList categories={categories} active={selectedCats} onToggle={toggleCat} />
        </div>
        <div className="card p-3 mb-3">
          <h6 className="mb-3">Price</h6>
          <div className="d-flex gap-2">
            <input className="form-control" type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input className="form-control" type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="inStock" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          <label className="form-check-label" htmlFor="inStock">In stock only</label>
        </div>
        <button className="btn btn-primary w-100" onClick={fetchList}>Apply</button>
      </div>
      <div className="col-md-9">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>{total} results</div>
          <select className="form-select" style={{maxWidth: 220}} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort by…</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
        {loading && <div className="alert alert-info">Loading…</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-3">
          {books.map((b) => (
            <div key={b.id} className="col-6 col-lg-4">
              <BookCard book={b} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



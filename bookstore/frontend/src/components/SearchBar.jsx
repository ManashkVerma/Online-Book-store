import React from 'react'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search by title or author' }) {
  return (
    <form className="d-flex" onSubmit={(e) => { e.preventDefault(); onSubmit?.() }}>
      <input className="form-control" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </form>
  )
}



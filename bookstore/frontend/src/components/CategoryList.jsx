import React from 'react'

export default function CategoryList({ categories = [], active = [], onToggle }) {
  return (
    <div className="list-group">
      {categories.map((c) => (
        <button key={c} type="button" className={`list-group-item list-group-item-action ${active.includes(c) ? 'active' : ''}`} onClick={() => onToggle(c)}>
          {c}
        </button>
      ))}
    </div>
  )
}



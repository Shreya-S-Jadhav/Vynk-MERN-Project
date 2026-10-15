import { useState, useRef, useEffect } from 'react'

const categories = [
  'All Categories',
  'Clothing',
  'Toys',
  'Accessories',
  'Electronics',
  'Miscellaneous'
]

const sortOptions = [
  { value: '', label: 'Featured Drops' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' }
]

function SearchBar({ search, setSearch, category, setCategory, sort, setSort, onReset }) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const categoryRef = useRef(null)
  const sortRef = useRef(null)

  const hasActiveFilters = search.trim() || (category && category !== 'All Categories') || sort

  // Close dropdowns if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentCategoryLabel = category && category !== 'All Categories' ? category : 'All Categories'
  const currentSortLabel = sortOptions.find((opt) => opt.value === sort)?.label || 'Featured Drops'

  return (
    <div className="vynk-catalog-toolbar">
      <div className="vynk-search-row-elevated">
        {/* Search Field */}
        <div className="vynk-search-field-wrap">
          <svg
            className="vynk-search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clothing, toys, gear, lifestyle..."
            className="vynk-search-input-elevated"
            aria-label="Search products"
          />
          {search && (
            <button
              type="button"
              className="vynk-search-clear-btn"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="vynk-custom-select-wrap" ref={categoryRef}>
          <button
            type="button"
            className={`vynk-sort-trigger ${categoryOpen ? 'active' : ''} ${category && category !== 'All Categories' ? 'has-val' : ''}`}
            onClick={() => {
              setCategoryOpen(!categoryOpen)
              setSortOpen(false)
            }}
            aria-haspopup="listbox"
            aria-expanded={categoryOpen}
          >
            <span className="vynk-sort-label-dim">Category:</span>
            <span className="vynk-sort-current-val">{currentCategoryLabel}</span>
            <svg
              className={`vynk-sort-chevron ${categoryOpen ? 'open' : ''}`}
              viewBox="0 0 20 20"
              width="14"
              height="14"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {categoryOpen && (
            <ul className="vynk-sort-menu" role="listbox">
              {categories.map((c) => {
                const isSelected = (c === 'All Categories' && (!category || category === 'All Categories')) || category === c
                return (
                  <li
                    key={c}
                    role="option"
                    aria-selected={isSelected}
                    className={`vynk-sort-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setCategory(c)
                      setCategoryOpen(false)
                    }}
                  >
                    <span>{c}</span>
                    {isSelected && <span className="vynk-sort-check">✓</span>}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="vynk-custom-select-wrap" ref={sortRef}>
          <button
            type="button"
            className={`vynk-sort-trigger ${sortOpen ? 'active' : ''} ${sort ? 'has-val' : ''}`}
            onClick={() => {
              setSortOpen(!sortOpen)
              setCategoryOpen(false)
            }}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <span className="vynk-sort-label-dim">Sort:</span>
            <span className="vynk-sort-current-val">{currentSortLabel}</span>
            <svg
              className={`vynk-sort-chevron ${sortOpen ? 'open' : ''}`}
              viewBox="0 0 20 20"
              width="14"
              height="14"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {sortOpen && (
            <ul className="vynk-sort-menu" role="listbox">
              {sortOptions.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={sort === opt.value}
                  className={`vynk-sort-option ${sort === opt.value ? 'selected' : ''}`}
                  onClick={() => {
                    setSort(opt.value)
                    setSortOpen(false)
                  }}
                >
                  <span>{opt.label}</span>
                  {sort === opt.value && <span className="vynk-sort-check">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <button
            type="button"
            className="vynk-reset-filters-pill"
            onClick={onReset}
            title="Reset all filters"
          >
            Clear Filters ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
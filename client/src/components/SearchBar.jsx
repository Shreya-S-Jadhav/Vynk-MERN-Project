const categories = ['All Categories', 'Electronics', 'Accessories', 'Audio', 'Furniture', 'Lighting', 'Home', 'Fashion']

function SearchBar({ search, setSearch, category, setCategory, sort, setSort, onReset }) {
  const hasActiveFilters = search.trim() || (category && category !== 'All Categories') || sort

  return (
    <div className="vynk-filter-bar">
      <div className="vynk-search-box">
        <svg className="vynk-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, brands, essentials..."
          className="vynk-search-input"
          aria-label="Search products"
        />
        {search && (
          <button type="button" className="vynk-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      <div className="vynk-select-group">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="vynk-select-control"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="vynk-select-control"
          aria-label="Sort products"
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        {hasActiveFilters && (
          <button type="button" className="vynk-reset-filters-btn" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
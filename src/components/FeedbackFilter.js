import React from "react"
import "./FeedbackFilter.css"

const FeedbackFilter = ({ onFilterChange }) => {
  const handleRatingChange = (e) => {
    onFilterChange({ rating: e.target.value })
  }

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value })
  }

  return (
    <div className="feedback-filter">
      <div className="filter-group">
        <label htmlFor="rating-filter">Filter by Rating:</label>
        <select id="rating-filter" onChange={handleRatingChange} className="filter-select">
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter">Sort by:</label>
        <select id="sort-filter" onChange={handleSortChange} className="filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  )
}

export default FeedbackFilter

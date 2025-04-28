import { useState } from "react"
import "./StarRating.css"

const StarRating = ({ initialRating = 0, onChange, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  const handleClick = (index) => {
    if (readOnly) return

    const newRating = index
    setRating(newRating)

    if (onChange) {
      onChange(newRating)
    }
  }

  const handleMouseEnter = (index) => {
    if (readOnly) return
    setHover(index)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHover(0)
  }

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        index += 1
        return (
          <button
            type="button"
            key={index}
            className={`star ${index <= (hover || rating) ? "active" : ""} ${readOnly ? "read-only" : ""}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${index} out of 5 stars`}
          >
            <span className="star-icon">★</span>
          </button>
        )
      })}
      {!readOnly && <span className="rating-value">{hover || rating || ""}</span>}
    </div>
  )
}

export default StarRating

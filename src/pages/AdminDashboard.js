import { useEffect, useState } from "react"
import FeedbackItem from "../components/FeedbackItem"
import FeedbackFilter from "../components/FeedbackFilter"
import { useFeedback } from "../context/FeedbackContext"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const { getAllFeedbacks, feedbacks, loading, error } = useFeedback()
  const [filters, setFilters] = useState({
    rating: "",
    sortBy: "newest",
  })
  const [fetchError, setFetchError] = useState(null)
  const [fetchAttempts, setFetchAttempts] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        await getAllFeedbacks(filters)
        setFetchError(null)
      } catch (err) {
        console.error("Admin: Error fetching feedbacks:", err)
        setFetchError("Failed to load feedbacks. Please try again later.")

        if (fetchAttempts < maxRetries) {
          setTimeout(() => {
            setFetchAttempts((prev) => prev + 1)
          }, 2000)
        }
      }
    }

    fetchFeedbacks()
  }, [filters, fetchAttempts]) // Added filters to dependency array

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }))
  }

  const handleRetry = () => {
    setFetchAttempts((prev) => prev + 1)
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and respond to client feedback</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {fetchError && (
        <div className="alert alert-danger">
          {fetchError}
          <button className="btn btn-sm btn-outline ml-3" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      <FeedbackFilter 
        onFilterChange={handleFilterChange} 
        currentFilters={filters} 
      />

      <div className="admin-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="mt-3">Loading feedbacks...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <h3>No feedbacks found</h3>
            <p>There are no feedbacks matching your current filters.</p>
          </div>
        ) : (
          <div className="feedback-list">
            <div className="feedback-count">
              Showing {feedbacks.length} {feedbacks.length === 1 ? "feedback" : "feedbacks"}
              {filters.rating && ` with ${filters.rating} star${filters.rating === '1' ? '' : 's'}`}
            </div>

            {feedbacks.map((feedback) => (
              <FeedbackItem key={feedback._id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
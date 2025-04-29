import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useFeedback } from "../context/FeedbackContext"
import "./Dashboard.css"

const Dashboard = () => {
  const { user } = useAuth()
  const { getAllFeedbacks, loading} = useFeedback()
  const [userFeedbacks, setUserFeedbacks] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [expandedReplies, setExpandedReplies] = useState({})

  useEffect(() => {
    const fetchUserFeedbacks = async () => {
      try {
        const feedbacks = await getAllFeedbacks({ userId: user._id })
        setUserFeedbacks(feedbacks)
      } catch (err) {
        console.error("Error fetching user feedbacks:", err)
        if (err.response?.status === 403) {
          setFetchError("Unable to load feedback. Please try again later.")
        } else {
          setFetchError(err.response?.data?.message || "Failed to load your feedback history. Please try again later.")
        }
      }
    }

    if (user && user._id) {
      fetchUserFeedbacks()
    }
  }, [user])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const toggleReplies = (feedbackId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [feedbackId]: !prev[feedbackId]
    }))
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <Link to="/submit-feedback" className="btn btn-primary">
          Submit New Feedback
        </Link>
      </div>

      {fetchError && !fetchError.includes("admin") && <div className="alert alert-danger">{fetchError}</div>}

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Your Feedback History</h2>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p className="mt-3">Loading your feedback history...</p>
            </div>
          ) : userFeedbacks.length === 0 ? (
            <div className="empty-state">
              <p>You haven't submitted any feedback yet.</p>
              <Link to="/submit-feedback" className="btn btn-outline">
                Submit Your First Feedback
              </Link>
            </div>
          ) : (
            <div className="feedback-list">
              {userFeedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-card-header">
                    <div className="rating-badge">{feedback.rating} ★</div>
                    <div className="feedback-date">{formatDate(feedback.createdAt)}</div>
                  </div>

                  <div className="feedback-card-body">
                    <p>{feedback.text}</p>
                    {feedback.imageUrl && (
                      <div className="feedback-thumbnail">
                        <img src={`http://localhost:5000${feedback.imageUrl}`} alt="Feedback attachment" />
                      </div>
                    )}
                  </div>

                  {feedback.replies && feedback.replies.length > 0 && (
                    <>
                      <div 
                        className="feedback-replies-toggle"
                        onClick={() => toggleReplies(feedback._id)}
                      >
                        <span>
                          {feedback.replies.length} {feedback.replies.length === 1 ? "reply" : "replies"} from admin
                        </span>
                        <span className={`toggle-icon ${expandedReplies[feedback._id] ? 'expanded' : ''}`}>
                          ▼
                        </span>
                      </div>
                      {expandedReplies[feedback._id] && (
                        <div className="feedback-replies">
                          {feedback.replies.map((reply, index) => (
                            <div key={index} className="reply-item">
                              <div className="reply-header">
                                <span className="admin-name">{reply.admin?.name || "Admin Reply"}</span>
                                <span className="reply-date">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="reply-text">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
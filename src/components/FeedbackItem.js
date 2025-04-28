import { useState } from "react"
import StarRating from "./StarRating"
import { useFeedback } from "../context/FeedbackContext"
import { useAuth } from "../context/AuthContext"
import "./FeedbackItem.css"

const FeedbackItem = ({ feedback }) => {
  const { addReplyToFeedback, getAIReplySuggestions } = useFeedback()
  const { isAdmin } = useAuth()
  const [replyText, setReplyText] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    try {
      await addReplyToFeedback(feedback._id, replyText)
      setReplyText("")
      setShowReplyForm(false)
    } catch (error) {
      console.error("Failed to add reply:", error)
    }
  }

  const handleGetSuggestions = async () => {
    try {
      setLoadingSuggestions(true)
      const fetchedSuggestions = await getAIReplySuggestions(feedback._id)
      setSuggestions(fetchedSuggestions)
    } catch (error) {
      console.error("Failed to get suggestions:", error)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleUseSuggestion = (suggestion) => {
    setReplyText(suggestion)
  }

  return (
    <div className="feedback-item">
      <div className="feedback-header">
        <div className="user-info">
          <h3>{feedback.user.name}</h3>
          <span className="date">{formatDate(feedback.createdAt)}</span>
        </div>
        <div className="rating-display">
          <StarRating initialRating={feedback.rating} readOnly={true} />
        </div>
      </div>

      <div className="feedback-content">
        <p>{feedback.text}</p>
        {feedback.imageUrl && (
          <div className="feedback-image">
            <img src={`http://localhost:5000${feedback.imageUrl}`} alt="Feedback attachment" />
          </div>
        )}
      </div>

      {feedback.replies && feedback.replies.length > 0 && (
        <div className="replies-section">
          <h4>Admin Replies</h4>
          {feedback.replies.map((reply, index) => (
            <div key={index} className="reply-item">
              <div className="reply-header">
                <span className="admin-name">{reply.admin.name} (Admin)</span>
                <span className="date">{formatDate(reply.createdAt)}</span>
              </div>
              <p>{reply.text}</p>
            </div>
          ))}
        </div>
      )}

      {isAdmin() && (
        <div className="admin-actions">
          {!showReplyForm ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowReplyForm(true)
                handleGetSuggestions()
              }}
            >
              Reply to Feedback
            </button>
          ) : (
            <form onSubmit={handleReplySubmit} className="reply-form">
              {loadingSuggestions ? (
                <div className="loading-suggestions">Loading suggestions...</div>
              ) : (
                suggestions.length > 0 && (
                  <div className="suggestions">
                    <h4>Suggested Replies:</h4>
                    <div className="suggestion-list">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => handleUseSuggestion(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                required
              ></textarea>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowReplyForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Reply
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedbackItem

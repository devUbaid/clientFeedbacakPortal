import { createContext, useState, useContext } from "react"
import api from "../utils/axiosConfig"

const FeedbackContext = createContext()

export const useFeedback = () => useContext(FeedbackContext)

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Submit new feedback
  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true)
      setError(null)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("text", feedbackData.text)
      formData.append("rating", feedbackData.rating)

      if (feedbackData.image) {
        formData.append("image", feedbackData.image)
      }

      const response = await api.post("/api/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setSuccess("Feedback submitted successfully!")
      return response.data.feedback
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get all feedbacks (admin only) or user feedbacks
  const getAllFeedbacks = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
  
      // Build query string from filters
      const queryParams = new URLSearchParams();
  
      if (filters.rating) {
        queryParams.append("rating", filters.rating);
      }
  
      if (filters.sortBy) {
        queryParams.append("sortBy", filters.sortBy);
      }
  
      // If userId is provided, use the user-specific endpoint
      let endpoint = "/api/feedback";
      if (filters.userId) {
        endpoint = "/api/feedback/user";
        queryParams.append("userId", filters.userId);
      }
  

  
      const response = await api.get(`${endpoint}?${queryParams}`);
  
  
  
      if (!response.data || !response.data.feedbacks) {
        throw new Error("Invalid response format from server");
      }
  
      // Ensure all IDs are strings for consistent comparison
      const processedFeedbacks = response.data.feedbacks
  .filter((fb) => fb && fb._id && fb.user && fb.user._id) // Filter bad data
  .map((feedback) => ({
    ...feedback,
    _id: feedback._id.toString(),
    user: {
      ...feedback.user,
      _id: feedback.user._id.toString(),
    },
  }));

  
      // Only update the global feedbacks state if we're not fetching for a specific user
      if (!filters.userId) {
        setFeedbacks(processedFeedbacks);
      }
  
      return processedFeedbacks;
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch feedbacks";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get feedback by ID
  const getFeedbackById = async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get(`/api/feedback/${id}`)

      return response.data.feedback
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch feedback")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add admin reply to feedback
  const addReplyToFeedback = async (id, replyText) => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.post(`/api/feedback/${id}/reply`, {
        text: replyText,
      })

      // Update the feedbacks state with the updated feedback
      setFeedbacks(feedbacks.map((feedback) => (feedback._id === id ? response.data.feedback : feedback)))

      setSuccess("Reply added successfully!")
      return response.data.feedback
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add reply")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get AI reply suggestions
  const getAIReplySuggestions = async (id) => {
      try {
          const response = await api.get(`/api/feedback/${id}/suggestions`)
          return response.data.suggestions
        } catch (err) {
          console.error("Failed to get reply suggestions:", err)
          throw err
        }
      }

  // Clear success message
  const clearSuccess = () => {
    setSuccess(null)
  }

  // Clear error message
  const clearError = () => {
    setError(null)
  }

  const value = {
    feedbacks,
    loading,
    error,
    success,
    submitFeedback,
    getAllFeedbacks,
    getFeedbackById,
    addReplyToFeedback,
    getAIReplySuggestions,
    clearSuccess,
    clearError,
  }

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

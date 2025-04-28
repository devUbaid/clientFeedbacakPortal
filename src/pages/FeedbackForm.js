import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StarRating from "../components/StarRating"
import ImagePreview from "../components/ImagePreview"
import { useFeedback } from "../context/FeedbackContext"
import "./FeedbackForm.css"

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    text: "",
    rating: 0,
  })
  const [image, setImage] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitFeedback, success, error, clearSuccess, clearError } = useFeedback()
  const navigate = useNavigate()

  // Clear success/error messages when component unmounts
  useEffect(() => {
    return () => {
      clearSuccess()
      clearError()
    }
  }, [clearSuccess, clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    })

    // Clear error when user selects rating
    if (formErrors.rating) {
      setFormErrors({
        ...formErrors,
        rating: "",
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setFormErrors({
          ...formErrors,
          image: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)",
        })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          image: "Image size should be less than 5MB",
        })
        return
      }

      setImage(file)

      // Clear error when user uploads valid image
      if (formErrors.image) {
        setFormErrors({
          ...formErrors,
          image: "",
        })
      }
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  const validateForm = () => {
    const errors = {}
    const { text, rating } = formData

    if (!text.trim()) {
      errors.text = "Feedback text is required"
    }

    if (rating === 0) {
      errors.rating = "Please select a rating"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await submitFeedback({
        ...formData,
        image,
      })

      // Reset form after successful submission
      setFormData({
        text: "",
        rating: 0,
      })
      setImage(null)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("Feedback submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="feedback-form-container">
      <div className="feedback-form-card">
        <h2>Submit Your Feedback</h2>
        <p className="form-subtitle">We value your opinion! Please share your thoughts with us.</p>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <div className="rating-container">
              <StarRating initialRating={formData.rating} onChange={handleRatingChange} />
              {formErrors.rating && <div className="form-error">{formErrors.rating}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="text" className="form-label">
              Your Feedback
            </label>
            <textarea
              id="text"
              name="text"
              className={`form-control ${formErrors.text ? "is-invalid" : ""}`}
              value={formData.text}
              onChange={handleChange}
              placeholder="Please share your experience with us..."
              rows="5"
            ></textarea>
            {formErrors.text && <div className="form-error">{formErrors.text}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Attach Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className={`form-control file-input ${formErrors.image ? "is-invalid" : ""}`}
              onChange={handleImageChange}
              accept="image/*"
            />
            <small className="form-text text-muted">Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WEBP</small>
            {formErrors.image && <div className="form-error">{formErrors.image}</div>}

            {image && <ImagePreview file={image} onRemove={handleRemoveImage} />}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackForm

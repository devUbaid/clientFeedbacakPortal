import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./AuthPages.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, error } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setFormErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format"
    if (!formData.password) errors.password = "Password is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await login(formData)
    } catch (err) {
      console.error("Login error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h2>Login to Your Account</h2>
      <p className="auth-subtitle">Welcome back! Please enter your credentials to access your account.</p>
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "invalid" : ""}
            />
            {formErrors.email && <span className="error">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? "invalid" : ""}
            />
            {formErrors.password && <span className="error">{formErrors.password}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
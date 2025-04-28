import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />
  }

  // Redirect to dashboard if not admin
  if (!isAdmin()) {
    return <Navigate to="/dashboard" />
  }

  // Render children if authenticated and admin
  return children
}

export default AdminRoute

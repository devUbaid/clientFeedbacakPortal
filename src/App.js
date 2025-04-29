import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FeedbackForm from "./pages/FeedbackForm";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : isAdmin() ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register />
              ) : isAdmin() ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-feedback"
            element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

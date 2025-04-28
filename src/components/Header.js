import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Header.css"

const Header = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isLandingPage = location.pathname === "/"
  const isAdminUser = user && isAdmin()
  const isAdminRoute = location.pathname.startsWith("/admin") // Changed variable name for clarity
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className={`header ${scrolled ? "scrolled" : ""} ${isLandingPage ? "landing-header" : ""}`}>
      <div className="container">
        <div className="logo" style={{ cursor: "pointer" }}>
          <span className="logo-icon">💬</span>
          <span className="logo-text">FeedbackPro</span>
        </div>

        <button className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          {user ? (
            <>
              <ul className="nav-links">
                {/* Show regular user links only when NOT on admin routes */}
                {!isAdminRoute && (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className={location.pathname === "/dashboard" ? "active" : ""}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/submit-feedback"
                        onClick={() => setMenuOpen(false)}
                        className={location.pathname === "/submit-feedback" ? "active" : ""}
                      >
                        Submit Feedback
                      </Link>
                    </li>
                  </>
                )}
                {/* Show admin link when user is admin */}
                {isAdminUser && (
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className={isAdminRoute ? "active" : ""}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
              <div className="user-actions">
                <div className="user-profile">
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <span className="user-name">{user.name}</span>
                </div>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="nav-links">
              {isAuthPage && (
                <li>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      navigate("/")
                      setMenuOpen(false)
                    }}
                  >
                    Home
                  </button>
                </li>
              )}
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={location.pathname === "/login" ? "active" : ""}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary nav-button">
                  Sign Up Free
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
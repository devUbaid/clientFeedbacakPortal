import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./LandingPage.css"

const LandingPage = () => {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    testimonials: false,
    cta: false,
  })

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === heroRef.current) {
            setIsVisible((prev) => ({ ...prev, hero: true }))
          } else if (entry.target === featuresRef.current) {
            setIsVisible((prev) => ({ ...prev, features: true }))
          } else if (entry.target === howItWorksRef.current) {
            setIsVisible((prev) => ({ ...prev, howItWorks: true }))
          } else if (entry.target === testimonialsRef.current) {
            setIsVisible((prev) => ({ ...prev, testimonials: true }))
          } else if (entry.target === ctaRef.current) {
            setIsVisible((prev) => ({ ...prev, cta: true }))
          }
        }
      })
    }, observerOptions)

    if (heroRef.current) observer.observe(heroRef.current)
    if (featuresRef.current) observer.observe(featuresRef.current)
    if (howItWorksRef.current) observer.observe(howItWorksRef.current)
    if (testimonialsRef.current) observer.observe(testimonialsRef.current)
    if (ctaRef.current) observer.observe(ctaRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (featuresRef.current) observer.unobserve(featuresRef.current)
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current)
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current)
      if (ctaRef.current) observer.unobserve(ctaRef.current)
    }
  }, [])

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section ref={heroRef} className={`hero-section ${isVisible.hero ? "visible" : ""}`}>
        <div className="hero-content">
          <h1>Transform Customer Feedback Into Growth</h1>
          <p>
            Collect, analyze, and respond to customer feedback all in one place. Make data-driven decisions that improve
            your business.
          </p>
          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="feedback-card-demo">
            <div className="demo-header">
              <div className="demo-avatar"></div>
              <div className="demo-info">
                <div className="demo-name">Sarah Johnson</div>
                <div className="demo-date">Today</div>
              </div>
              <div className="demo-rating">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </div>
            <div className="demo-content">
              "The customer service was exceptional! The team went above and beyond to help me resolve my issue
              quickly."
            </div>
            <div className="demo-reply">
              <div className="demo-reply-header">Admin Reply:</div>
              <div className="demo-reply-text">
                Thank you for your kind words, Sarah! We're thrilled to hear about your positive experience.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`features-section ${isVisible.features ? "visible" : ""}`}>
        <h2>Powerful Features to Enhance Your Business</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feedback-icon"></div>
            <h3>Collect Feedback</h3>
            <p>Easily gather customer feedback with customizable forms and star ratings.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon analyze-icon"></div>
            <h3>Analyze Responses</h3>
            <p>Filter and sort feedback to identify trends and areas for improvement.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon respond-icon"></div>
            <h3>Respond Quickly</h3>
            <p>Reply to customer feedback with AI-suggested responses to save time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon secure-icon"></div>
            <h3>Secure Platform</h3>
            <p>Keep your data safe with our secure authentication and role-based access.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className={`how-it-works-section ${isVisible.howItWorks ? "visible" : ""}`}>
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account in seconds and set up your feedback portal.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Collect Feedback</h3>
            <p>Customers submit their feedback with ratings and optional images.</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Respond & Improve</h3>
            <p>Reply to feedback and implement changes based on insights.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className={`testimonials-section ${isVisible.testimonials ? "visible" : ""}`}>
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p>
              "This platform has transformed how we handle customer feedback. We've seen a 30% increase in customer
              satisfaction since implementing it."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar avatar-1"></div>
              <div className="author-info">
                <div className="author-name">Michael Chen</div>
                <div className="author-title">CEO, TechSolutions Inc.</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p>
              "The AI-suggested responses save our team hours each week, and the analytics help us identify key areas
              for improvement."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar avatar-2"></div>
              <div className="author-info">
                <div className="author-name">Priya Sharma</div>
                <div className="author-title">Customer Success Manager</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p>
              "Easy to use and incredibly effective. Our customers appreciate how quickly we can now respond to their
              feedback."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar avatar-3"></div>
              <div className="author-info">
                <div className="author-name">James Wilson</div>
                <div className="author-title">Small Business Owner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className={`cta-section ${isVisible.cta ? "visible" : ""}`}>
        <div className="cta-content">
          <h2>Ready to Transform Your Customer Feedback Experience?</h2>
          <p>Join thousands of businesses that use our platform to improve customer satisfaction and drive growth.</p>
          {!user ? (
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started For Free
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default LandingPage

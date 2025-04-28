import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import "./index.css"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { FeedbackProvider } from "./context/FeedbackContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <FeedbackProvider>
          <App />
        </FeedbackProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)

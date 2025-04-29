import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../utils/axiosConfig";

const AuthContext = createContext();
function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000; // exp is in seconds
  } catch {
    return true;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      // If token expired, force logout
      if (isTokenExpired(storedToken)) {
        logout();
      } else {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

        // Protect admin routes
        if (
          window.location.pathname.startsWith("/admin") &&
          parsedUser.role !== "admin"
        ) {
          navigate("/dashboard", { replace: true });
        }
      }
    }
    setLoading(false);
  }, [navigate]);

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/api/auth/register", userData);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/api/auth/login", credentials);
      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

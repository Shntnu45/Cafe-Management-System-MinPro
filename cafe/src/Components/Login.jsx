import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { toast } from 'react-toastify';

export function Login({ onLogin }) {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, password, role });
      console.log('Login response:', response);
      
      const actualUserRole = response.user?.role;
      
      // Map backend role to frontend role for consistency
      const frontendRole = actualUserRole === 'customer' ? 'user' : actualUserRole;
      
      const userData = { 
        name: response.user?.name || email, 
        role: frontendRole,
        email: response.user?.email || email,
        id: response.user?.id
      };
      
      onLogin(userData);
      toast.success(`Logged in successfully as ${role === 'user' ? 'User' : 'Admin'}!`);
      
      // Navigate based on role
      if (frontendRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/table-selection');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error(error.response?.data?.message || "Login failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/src/assets/cafeCofee.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          maxWidth: "420px",
          width: "90%",
          color: "#333",
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#6f4e37" }}>
          Welcome Back
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <button
            type="button"
            className={`btn me-2 ${
              role === "user" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setRole("user")}
          >
            Customer
          </button>
          <button
            type="button"
            className={`btn ${
              role === "admin" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 text-white"
            style={{
              backgroundColor: "#6f4e37",
              border: "none",
              fontWeight: "600",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : `Login as ${role === "user" ? "User" : "Admin"}`}
          </button>

          <p className="text-center mt-3 mb-0" style={{ color: "#6f4e37" }}>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="fw-semibold"
              style={{ color: "#c37b47", textDecoration: "none" }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

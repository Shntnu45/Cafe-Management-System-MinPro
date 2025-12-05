import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Role fixed to "user" (customer)
  const role = "user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register({ name: fullName, email, password, role });
      toast.success("Account created successfully as Customer!");
      setFullName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
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
          Create Your Customer Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create password"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center mt-3 mb-0" style={{ color: "#6f4e37" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold"
              style={{ color: "#c37b47", textDecoration: "none" }}
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

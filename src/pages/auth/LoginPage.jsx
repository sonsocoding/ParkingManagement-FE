import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ParkingCircle, Eye, EyeOff } from "lucide-react";
import "../../styles/pages/auth/Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-hero-badge">🅿️ Smart Parking</div>
          <h1 className="auth-hero-title">
            Park smarter,
            <br />
            not harder.
          </h1>
          <p className="auth-hero-subtitle">
            Find, book, and manage parking spots with ease. Real-time availability, instant booking,
            and seamless payments.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">400+</span>
              <span className="auth-hero-stat-label">Parking Slots</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">3</span>
              <span className="auth-hero-stat-label">Locations</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">24/7</span>
              <span className="auth-hero-stat-label">Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-logo">
            <div className="auth-logo-icon">
              <ParkingCircle size={24} />
            </div>
            <span className="auth-logo-text">Smart Parking</span>
          </div>

          <h2 className="auth-card-title">Welcome back</h2>
          <p className="auth-card-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-password-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  color: "var(--color-occupied)",
                  fontSize: "13px",
                  marginBottom: "8px",
                  padding: "8px 12px",
                  background: "rgba(220,38,38,0.08)",
                  borderRadius: "8px",
                  border: "1px solid rgba(220,38,38,0.2)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-lg w-full ${loading ? "btn-loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

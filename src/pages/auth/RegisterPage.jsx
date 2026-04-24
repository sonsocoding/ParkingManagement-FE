import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ParkingCircle, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(form.email, form.password);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-hero-badge">🅿️ Smart Parking</div>
          <h1 className="auth-hero-title">
            Join the smart<br />parking revolution.
          </h1>
          <p className="auth-hero-subtitle">
            Create your account and start booking parking spots in seconds.
            No more circling the block.
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
            <span className="auth-logo-text">ParkSmart</span>
          </div>

          <h2 className="auth-card-title">Create your account</h2>
          <p className="auth-card-subtitle">Start managing your parking today</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input type="text" name="fullName" className="form-input" placeholder="Nguyen Van A" value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input type="tel" name="phone" className="form-input" placeholder="0901234567" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-password-wrap">
                <input type={showPass ? 'text' : 'password'} name="password" className="form-input" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className={`btn btn-primary btn-lg w-full ${loading ? 'btn-loading' : ''}`} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

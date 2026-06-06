import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((result) => {
      if (!result.error) {
        navigate('/');
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-image-side">
          <h1>Welcome<br/>Back</h1>
          <p>Access your curated selections.</p>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Log In</h2>
              <p className="auth-subtitle">Please enter your details.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
              
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account?
              <Link to="/register" className="auth-link">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
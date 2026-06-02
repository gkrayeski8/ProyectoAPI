import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Reusing Login.css for consistent auth styling

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration attempt with:', formData);
    // Add real registration logic here
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-image-side">
          <h1>Join<br/>Us</h1>
          <p>Create an account to unlock exclusive benefits.</p>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Sign Up</h2>
              <p className="auth-subtitle">Fill in your details below.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <button type="submit" className="btn-submit">
                Create Account
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?
              <Link to="/login" className="auth-link">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
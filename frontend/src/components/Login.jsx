import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
    // Add real login logic here
  };

  return (
    <div className="auth-container container">
      <div className="auth-bg-glow"></div>
      
      <div className="auth-card glass">
        <div className="auth-header">
          <h2 className="auth-title">Bienvenido</h2>
          <p className="auth-subtitle">Ingresa a tu cuenta para continuar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
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
              <span>Recordarme</span>
            </label>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-submit">
            Iniciar Sesión
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes una cuenta?
          <Link to="/registro" className="auth-link">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import './Login.css';

/**
 * Componente Login
 * Renderiza el formulario de inicio de sesión de usuario y se comunica con el store (authSlice)
 * para realizar la autenticación mediante el thunk loginUser.
 */
export default function Login() {
  // Estado local para manejar los valores del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Obtenemos el estado de carga y el posible error de autenticación desde Redux
  const { loading, error } = useSelector(state => state.auth);

  // Actualiza el campo correspondiente en el estado del formulario cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    // Despacha la acción asíncrona de login con las credenciales ingresadas
    dispatch(loginUser(formData)).then((result) => {
      // Si la promesa se resuelve sin errores, navegamos al inicio
      if (!result.error) {
        navigate('/');
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Panel decorativo izquierdo con mensaje de bienvenida */}
        <div className="auth-image-side">
          <h1>Welcome<br/>Back</h1>
          <p>Access your curated selections.</p>
        </div>
        
        {/* Panel derecho con el formulario de login */}
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Log In</h2>
              <p className="auth-subtitle">Please enter your details.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Campo de email */}
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

              {/* Campo de contraseña */}
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

              {/* Opciones extra: recordarme y olvidé contraseña */}
              <div className="auth-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              {/* Muestra el mensaje de error si el login falla */}
              {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
              
              {/* Botón de submit deshabilitado mientras se procesa */}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Link para ir al registro si no tiene cuenta */}
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
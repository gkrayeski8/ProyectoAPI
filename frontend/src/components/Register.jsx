import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import './Login.css'; // Reusing Login.css for consistent auth styling

/**
 * Componente Register
 * Renderiza el formulario de registro de usuario y se comunica con el store
 * para realizar la creación de cuenta usando el thunk registerUser.
 */
export default function Register() {
  // Estado local con los campos del formulario de registro
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Extraemos el estado de carga y posible error desde el slice de autenticación
  const { loading, error } = useSelector(state => state.auth);

  // Actualiza el campo correspondiente en el estado cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    // Despachamos la acción asíncrona de registro con los datos del formulario
    dispatch(registerUser(formData)).then((result) => {
      // Si la petición es exitosa, redirigimos al home
      if (!result.error) {
        navigate('/');
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Panel decorativo izquierdo */}
        <div className="auth-image-side">
          <h1>Join<br/>Us</h1>
          <p>Create an account to unlock exclusive benefits.</p>
        </div>
        
        {/* Panel derecho con el formulario de registro */}
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Sign Up</h2>
              <p className="auth-subtitle">Fill in your details below.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Campo de nombre */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Juan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo de apellido */}
              <div className="form-group">
                <label className="form-label" htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  className="form-input"
                  placeholder="Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

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

              {/* Muestra el error si el registro falla */}
              {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

              {/* Botón de submit; deshabilitado mientras se procesa */}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Link para ir al login si ya tiene cuenta */}
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
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import './Profile.css';

/**
 * Componente Profile
 * Muestra la información del usuario autenticado y opciones de gestión de cuenta.
 * Redirige al login si no hay sesión activa.
 */
export default function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth); // Datos del usuario desde Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirigir al login si no está autenticado o si los datos del usuario no cargaron
  if (!isAuthenticated || !user) {
    return (
      <div className="profile-container error-container">
        <h3>Debes iniciar sesión para ver tu perfil</h3>
        <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  // Cierra la sesión y redirige al home
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Retorna la inicial del nombre o email para mostrar en el avatar circular
  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U'; // Fallback si no hay nombre ni email
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Cabecera con avatar, nombre y rol del usuario */}
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user.name, user.email)} {/* Muestra la inicial en el círculo */}
          </div>
          <h2 className="profile-name">{user.name} {user.apellido || ''}</h2>
          <span className="profile-role-tag">{user.role || 'COMPRADOR'}</span> {/* Rol por defecto: COMPRADOR */}
        </div>

        {/* Sección con los datos del perfil */}
        <div className="profile-body">
          <div className="profile-info-group">
            <label className="profile-info-label">Nombre</label>
            <div className="profile-info-value">{user.name}</div>
          </div>

          <div className="profile-info-group">
            <label className="profile-info-label">Apellido</label>
            <div className="profile-info-value">{user.apellido || 'No especificado'}</div>
          </div>

          <div className="profile-info-group">
            <label className="profile-info-label">Correo Electrónico</label>
            <div className="profile-info-value">{user.email}</div>
          </div>

          <div className="profile-info-group">
            <label className="profile-info-label">ID de Usuario</label>
            <div className="profile-info-value">#{user.id}</div>
          </div>
        </div>

        {/* Acciones disponibles para el usuario */}
        <div className="profile-actions">
          {/* Solo muestra el botón si el usuario no es vendedor ni admin */}
          {user.role !== 'VENDEDOR' && user.role !== 'ADMIN' && (
            <Link to="/become-seller" className="btn-become-seller">
              Convertirme en Vendedor
            </Link>
          )}
          {/* Edición de perfil (pendiente de implementación) */}
          <button className="btn-edit-profile" onClick={() => alert('Editar perfil próximamente')}>
            Editar Perfil
          </button>
          {/* Botón para cerrar sesión */}
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

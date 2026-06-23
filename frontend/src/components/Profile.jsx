import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import './Profile.css';

export default function Profile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirigir al login si no está autenticado
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

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user.name, user.email)}
          </div>
          <h2 className="profile-name">{user.name} {user.apellido || ''}</h2>
          <span className="profile-role-tag">{user.role || 'COMPRADOR'}</span>
        </div>

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

        <div className="profile-actions">
          {user.role !== 'VENDEDOR' && user.role !== 'ADMIN' && (
            <Link to="/become-seller" className="btn-become-seller">
              Convertirme en Vendedor
            </Link>
          )}
          <button className="btn-edit-profile" onClick={() => alert('Editar perfil próximamente')}>
            Editar Perfil
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { becomeSeller } from '../store/slices/authSlice';
import './BecomeSeller.css';

/**
 * Componente BecomeSeller
 * Muestra la landing para convertirse en vendedor.
 * Maneja 3 estados: no logueado, logueado como COMPRADOR, ya es VENDEDOR/ADMIN.
 * Incluye un paso de confirmación antes de despachar el thunk.
 */
export default function BecomeSeller() {
  const { isAuthenticated, user, loading, error } = useSelector(state => state.auth); // Estado de auth desde Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false); // Controla si se muestra el paso de confirmación

  // Si ya es vendedor, redirigir directamente al dashboard sin mostrar esta página
  if (isAuthenticated && user?.role === 'VENDEDOR') {
    navigate('/seller-dashboard');
    return null; // No renderiza nada mientras navega
  }

  // Despacha el thunk para convertirse en vendedor y redirige al dashboard si tiene éxito
  const handleConfirm = () => {
    dispatch(becomeSeller()).then(result => {
      if (!result.error) {
        navigate('/seller-dashboard');
      }
    });
  };

  // Lista de beneficios que se muestran en el panel izquierdo de la página
  const benefits = [
    { icon: '🛍️', title: 'Alcanzá más clientes', desc: 'Publicá tus productos y llegá a miles de compradores activos.' },
    { icon: '📊', title: 'Dashboard propio', desc: 'Gestioná tus publicaciones, stock y precios desde un panel centralizado.' },
    { icon: '⚡', title: 'Publicación inmediata', desc: 'Tus productos quedan disponibles en el catálogo al instante.' },
  ];

  return (
    <div className="become-seller-page">
      <div className="seller-content">

        {/* Sección izquierda — decorativa con headline y lista de beneficios */}
        <div className="seller-left">
          <div className="seller-left-inner">
            <p className="seller-eyebrow">Para vendedores</p>
            <h1 className="seller-headline">
              Empezá a vender<br />en TPO Market
            </h1>
            <p className="seller-tagline">
              Únite a nuestra comunidad de vendedores y hacé crecer tu negocio.
            </p>
            <div className="seller-benefits">
              {/* Renderiza cada beneficio como un ítem con ícono y descripción */}
              {benefits.map((b, i) => (
                <div key={i} className="seller-benefit-item">
                  <span className="benefit-icon">{b.icon}</span>
                  <div>
                    <strong>{b.title}</strong>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección derecha — tarjeta de acción */}
        <div className="seller-right">
          <div className="seller-card">

            {/* Vista inicial: muestra info y el botón de acción */}
            {!showConfirm ? (
              <>
                <div className="seller-card-header">
                  <div className="seller-icon-badge">🏪</div>
                  <h2>Registrarme como Vendedor</h2>
                  <p>Accedé a todas las herramientas para gestionar tu negocio en la plataforma.</p>
                </div>

                {/* Si está logueado como COMPRADOR, muestra sus datos y el botón para continuar */}
                {isAuthenticated ? (
                  <>
                    <div className="seller-user-info">
                      {/* Muestra la inicial del nombre del usuario */}
                      <div className="seller-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                      <div>
                        <strong>{user?.name} {user?.apellido}</strong>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    {/* Al hacer clic avanza al paso de confirmación */}
                    <button
                      className="btn-seller-primary"
                      onClick={() => setShowConfirm(true)}
                    >
                      Quiero ser Vendedor
                    </button>
                    <p className="seller-terms">
                      Al continuar, aceptás los términos y condiciones de la plataforma para vendedores.
                    </p>
                  </>
                ) : (
                  /* Si no está logueado, pide que inicie sesión primero */
                  <>
                    <p className="seller-login-hint">
                      Necesitás tener una cuenta para registrarte como vendedor.
                    </p>
                    <Link to="/login" className="btn-seller-primary">
                      Iniciar Sesión
                    </Link>
                    <div className="seller-register-link">
                      ¿No tenés cuenta?
                      <Link to="/register">Registrate gratis</Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Paso de confirmación: le muestra al usuario el impacto de la acción */
              <>
                <div className="seller-card-header">
                  <div className="seller-icon-badge confirm">✅</div>
                  <h2>¿Confirmás el cambio?</h2>
                  <p>
                    Tu cuenta pasará de <strong>Comprador</strong> a <strong>Vendedor</strong>.
                    Vas a poder publicar productos en la plataforma de forma inmediata.
                  </p>
                </div>

                {/* Aviso de que el cambio es irreversible desde la plataforma */}
                <div className="confirm-notice">
                  <span>ℹ️</span>
                  <p>Esta acción no se puede deshacer desde la plataforma. Si necesitás revertirla, contactá al soporte.</p>
                </div>

                {/* Muestra el error si el thunk becomeSeller falla */}
                {error && (
                  <div className="seller-error">{error}</div>
                )}

                {/* Botones de confirmación y cancelación */}
                <div className="confirm-actions">
                  <button
                    className="btn-seller-primary"
                    onClick={handleConfirm}
                    disabled={loading} // Deshabilitado mientras se procesa
                  >
                    {loading ? 'Procesando...' : 'Sí, quiero ser Vendedor'}
                  </button>
                  <button
                    className="btn-seller-secondary"
                    onClick={() => setShowConfirm(false)} // Vuelve al paso anterior
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

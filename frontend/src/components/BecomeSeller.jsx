import React from 'react';
import './BecomeSeller.css';

const BecomeSeller = () => {
  return (
    <div className="become-seller-page">
      <div className="seller-hero">
        <h1>Empieza a vender en TPO Market</h1>
        <p>Llega a miles de clientes activos cada día y haz crecer tu negocio en nuestra plataforma. Únete a nuestra comunidad de vendedores y disfruta de grandes beneficios.</p>
        <button className="btn-primary" onClick={() => alert('Próximamente: Flujo de registro de vendedor')}>
          Registrarme como Vendedor
        </button>
      </div>
    </div>
  );
};

export default BecomeSeller;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { publishProduct, resetSuccess } from '../store/slices/productsSlice';

/**
 * Componente AdminPanel
 * Panel simple para que un administrador pueda publicar productos directamente.
 * Usa el mismo thunk publishProduct del slice de productos.
 */
export default function AdminPanel() {
  const dispatch = useDispatch();
  // Leemos el estado del slice de productos para mostrar feedback al admin
  const { loading, error, success } = useSelector(state => state.products);
  
  // Estado local del formulario con los campos del producto
  const [formData, setFormData] = useState({
    titulo: '',
    description: '',
    category: '',
    urlImage: '',
    stock: 0,
    price: 0
  });

  // Actualiza el campo correspondiente en el estado del formulario cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Despacha el thunk para publicar el producto con los datos del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    dispatch(publishProduct(formData));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Panel de Administración - Agregar Producto</h2>
      
      {/* Mensaje de éxito al publicar un producto */}
      {success && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px' }}>
          ¡Producto publicado exitosamente!
          {/* Botón para cerrar el mensaje y poder publicar otro */}
          <button onClick={() => dispatch(resetSuccess())} style={{ marginLeft: '10px' }}>x</button>
        </div>
      )}
      
      {/* Mensaje de error si la publicación falla */}
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px' }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Campo de título */}
        <div>
          <label>Título:</label><br />
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        {/* Campo de descripción */}
        <div>
          <label>Descripción:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        {/* Campo de categoría */}
        <div>
          <label>Categoría:</label><br />
          <input type="text" name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        {/* Campo de URL de la imagen (opcional) */}
        <div>
          <label>URL de la Imagen:</label><br />
          <input type="text" name="urlImage" value={formData.urlImage} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
        </div>
        
        {/* Campo de stock */}
        <div>
          <label>Stock:</label><br />
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        {/* Campo de precio con paso de 0.01 para admitir centavos */}
        <div>
          <label>Precio:</label><br />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" style={{ width: '100%', padding: '5px' }} />
        </div>
        
        {/* Botón de submit deshabilitado mientras se procesa */}
        <button type="submit" disabled={loading} style={{ padding: '10px', marginTop: '10px', cursor: 'pointer' }}>
          {loading ? 'Publicando...' : 'Publicar Producto'}
        </button>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { publishProduct, resetSuccess } from '../store/slices/productsSlice';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.products);
  
  const [formData, setFormData] = useState({
    titulo: '',
    description: '',
    category: '',
    urlImage: '',
    stock: 0,
    price: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(publishProduct(formData));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Panel de Administración - Agregar Producto</h2>
      
      {success && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px' }}>
          ¡Producto publicado exitosamente!
          <button onClick={() => dispatch(resetSuccess())} style={{ marginLeft: '10px' }}>x</button>
        </div>
      )}
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px' }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Título:</label><br />
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        <div>
          <label>Descripción:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        <div>
          <label>Categoría:</label><br />
          <input type="text" name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        <div>
          <label>URL de la Imagen:</label><br />
          <input type="text" name="urlImage" value={formData.urlImage} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
        </div>
        
        <div>
          <label>Stock:</label><br />
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '5px' }} />
        </div>
        
        <div>
          <label>Precio:</label><br />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" style={{ width: '100%', padding: '5px' }} />
        </div>
        
        <button type="submit" disabled={loading} style={{ padding: '10px', marginTop: '10px', cursor: 'pointer' }}>
          {loading ? 'Publicando...' : 'Publicar Producto'}
        </button>
      </form>
    </div>
  );
}
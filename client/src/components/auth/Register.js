import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    papel: 'professor'
  });
  
  const navigate = useNavigate();

  const { name, email, password, papel } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      const res = await axios.post('/api/usuarios', { 
        name, 
        email, 
        password, 
        role: papel 
      });
      alert('Registro bem-sucedido! Por favor faça login.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || 'Falha no registro');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Registrar</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nome"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Endereço de Email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Senha"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <select
            name="papel"
            value={papel}
            onChange={onChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="professor">Professor</option>
            <option value="aluno">Aluno</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Já tem uma conta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
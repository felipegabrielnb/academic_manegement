import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, senha } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      const res = await axios.post('/api/autenticacao', { email, senha });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || 'Falha no login');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
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
            name="senha"
            value={senha}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Não tem uma conta? <Link to="/register">Registrar</Link>
      </p>
    </div>
  );
};

export default Login;
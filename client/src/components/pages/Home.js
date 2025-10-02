import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="card">
        <h1>Bem-vindo ao Sistema de Gestão Acadêmica</h1>
        <p>
          Gerencie alunos, cursos, notas e frequência em uma plataforma abrangente.
          Otimize sua administração acadêmica com nossa interface intuitiva.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Registrar
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Recursos</h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>Gerenciamento de alunos com perfis completos</li>
          <li>Agendamento e gerenciamento de cursos</li>
          <li>Acompanhamento e análise de notas</li>
          <li>Monitoramento de frequência</li>
          <li>Autenticação segura e acesso baseado em papéis</li>
          <li>Design responsivo para todos os dispositivos</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
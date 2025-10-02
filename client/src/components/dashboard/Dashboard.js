import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    alunos: 0,
    cursos: 0,
    notas: 0,
    frequencia: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        // Obter estatísticas de diferentes endpoints
        const [alunosRes, cursosRes, notasRes, frequenciaRes] = await Promise.all([
          axios.get('/api/alunos', config),
          axios.get('/api/cursos', config),
          axios.get('/api/notas', config),
          axios.get('/api/frequencia', config)
        ]);

        setStats({
          alunos: alunosRes.data.length,
          cursos: cursosRes.data.length,
          notas: notasRes.data.length,
          frequencia: frequenciaRes.data.length
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Painel</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.alunos}</h3>
          <p>Alunos</p>
        </div>
        <div className="stat-card">
          <h3>{stats.cursos}</h3>
          <p>Cursos</p>
        </div>
        <div className="stat-card">
          <h3>{stats.notas}</h3>
          <p>Notas</p>
        </div>
        <div className="stat-card">
          <h3>{stats.frequencia}</h3>
          <p>Registros de Frequência</p>
        </div>
      </div>

      <div className="card">
        <h2>Ações Rápidas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/alunos" className="btn btn-primary">Gerenciar Alunos</Link>
          <Link to="/cursos" className="btn btn-primary">Gerenciar Cursos</Link>
          <Link to="/notas" className="btn btn-primary">Gerenciar Notas</Link>
          <Link to="/frequencia" className="btn btn-primary">Gerenciar Frequência</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
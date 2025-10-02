import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Sistema de Gestão Acadêmica
        </Link>
        <div className="navbar-nav">
          <Link to="/" className="nav-link">
            Início
          </Link>
          {!user ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn btn-primary">
                Registrar
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">
                Painel
              </Link>
              <Link to="/alunos" className="nav-link">
                Alunos
              </Link>
              <Link to="/cursos" className="nav-link">
                Cursos
              </Link>
              <Link to="/notas" className="nav-link">
                Notas
              </Link>
              <Link to="/frequencia" className="nav-link">
                Frequência
              </Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
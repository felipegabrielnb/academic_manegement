import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);

  // Se há um token no localStorage mas o usuário não está autenticado, verificar
  if (!isAuthenticated && token) {
    // Em um app real, você verificaria o token com o backend
    // Por enquanto, vamos assumir que o token é válido
    return children;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
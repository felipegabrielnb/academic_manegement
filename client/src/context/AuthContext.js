import React, { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        usuario: action.payload,
        token: action.token,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        usuario: null,
        token: null,
        isAuthenticated: false
      };
    case 'SET_USER':
      return {
        ...state,
        usuario: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    usuario: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Em um app real, você verificaria o token aqui
      // Por simplicidade, vamos apenas armazená-lo
      dispatch({
        type: 'LOGIN',
        payload: JSON.parse(localStorage.getItem('user')),
        token: token
      });
    }
  }, []);

  const login = (token, usuario = null) => {
    localStorage.setItem('token', token);
    if (usuario) {
      localStorage.setItem('user', JSON.stringify(usuario));
    }
    dispatch({
      type: 'LOGIN',
      payload: usuario || JSON.parse(atob(token.split('.')[1])).usuario,
      token: token
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
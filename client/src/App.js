import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Students from './components/students/Students';
import Courses from './components/courses/Courses';
import Grades from './components/grades/Grades';
import Attendance from './components/attendance/Attendance';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/alunos" 
                element={
                  <PrivateRoute>
                    <Students />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/cursos" 
                element={
                  <PrivateRoute>
                    <Courses />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/notas" 
                element={
                  <PrivateRoute>
                    <Grades />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/frequencia" 
                element={
                  <PrivateRoute>
                    <Attendance />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

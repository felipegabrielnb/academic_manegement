import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Grades = () => {
  const [notas, setNotas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    aluno: '',
    curso: '',
    nomeAvaliacao: '',
    nota: '',
    pontosMaximos: 100,
    professor: '',
    semestre: '',
    ano: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNotas();
    fetchAlunos();
    fetchCursos();
  }, []);

  const fetchNotas = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/notas', config);
      setNotas(res.data);
    } catch (err) {
      console.error('Erro ao buscar notas:', err);
    }
  };

  const fetchAlunos = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/alunos', config);
      setAlunos(res.data);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    }
  };

  const fetchCursos = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/cursos', config);
      setCursos(res.data);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
    }
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };

      // Obter usuário atual para definir como professor
      const usuario = JSON.parse(atob(token.split('.')[1])).usuario;
      const data = {
        ...formData,
        professor: usuario.id
      };

      if (editingId) {
        await axios.put(`/api/notas/${editingId}`, data, config);
      } else {
        await axios.post('/api/notas', data, config);
      }

      fetchNotas();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar nota:', err);
      alert(err.response?.data?.msg || 'Erro ao salvar nota');
    }
  };

  const deleteNota = async id => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`/api/notas/${id}`, config);
        fetchNotas();
      } catch (err) {
        console.error('Erro ao excluir nota:', err);
        alert('Erro ao excluir nota');
      }
    }
  };

  const editNota = nota => {
    setFormData({
      aluno: nota.aluno._id,
      curso: nota.curso._id,
      nomeAvaliacao: nota.nomeAvaliacao,
      nota: nota.nota,
      pontosMaximos: nota.pontosMaximos || 100,
      semestre: nota.semestre,
      ano: nota.ano
    });
    setEditingId(nota._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      aluno: '',
      curso: '',
      nomeAvaliacao: '',
      nota: '',
      pontosMaximos: 100,
      professor: '',
      semestre: '',
      ano: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Notas</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Adicionar Nota
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>{editingId ? 'Editar Nota' : 'Adicionar Nota'}</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <select
                name="aluno"
                value={formData.aluno}
                onChange={onChange}
                required
              >
                <option value="">Selecione o Aluno</option>
                {alunos.map(aluno => (
                  <option key={aluno._id} value={aluno._id}>
                    {aluno.nome} ({aluno.matricula})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                name="curso"
                value={formData.curso}
                onChange={onChange}
                required
              >
                <option value="">Selecione o Curso</option>
                {cursos.map(curso => (
                  <option key={curso._id} value={curso._id}>
                    {curso.titulo} ({curso.codigo})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome da Avaliação"
                name="nomeAvaliacao"
                value={formData.nomeAvaliacao}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Nota (0-100)"
                name="nota"
                min="0"
                max="100"
                value={formData.nota}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Pontos Máximos"
                name="pontosMaximos"
                value={formData.pontosMaximos}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Semestre"
                name="semestre"
                value={formData.semestre}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Ano"
                name="ano"
                value={formData.ano}
                onChange={onChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Atualizar' : 'Adicionar'} Nota
            </button>
            <button type="button" className="btn btn-danger" onClick={resetForm} style={{ marginLeft: '0.5rem' }}>
              Cancelar
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Curso</th>
              <th>Avaliação</th>
              <th>Nota</th>
              <th>Semestre</th>
              <th>Ano</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {notas.map(nota => (
              <tr key={nota._id}>
                <td>{nota.aluno ? nota.aluno.nome : 'N/A'}</td>
                <td>{nota.curso ? nota.curso.titulo : 'N/A'}</td>
                <td>{nota.nomeAvaliacao}</td>
                <td>{nota.nota}</td>
                <td>{nota.semestre}</td>
                <td>{nota.ano}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => editNota(nota)} style={{ marginRight: '0.5rem' }}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteNota(nota._id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
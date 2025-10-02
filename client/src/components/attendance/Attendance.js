import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [frequencia, setFrequencia] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    aluno: '',
    curso: '',
    data: '',
    status: 'presente',
    semestre: '',
    ano: '',
    observacoes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFrequencia();
    fetchAlunos();
    fetchCursos();
  }, []);

  const fetchFrequencia = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/frequencia', config);
      setFrequencia(res.data);
    } catch (err) {
      console.error('Erro ao buscar frequência:', err);
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
        await axios.put(`/api/frequencia/${editingId}`, data, config);
      } else {
        await axios.post('/api/frequencia', data, config);
      }

      fetchFrequencia();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar frequência:', err);
      alert(err.response?.data?.msg || 'Erro ao salvar frequência');
    }
  };

  const deleteFrequencia = async id => {
    if (window.confirm('Tem certeza que deseja excluir este registro de frequência?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`/api/frequencia/${id}`, config);
        fetchFrequencia();
      } catch (err) {
        console.error('Erro ao excluir frequência:', err);
        alert('Erro ao excluir frequência');
      }
    }
  };

  const editFrequencia = record => {
    setFormData({
      aluno: record.aluno._id,
      curso: record.curso._id,
      data: record.data.substring(0, 10),
      status: record.status,
      semestre: record.semestre,
      ano: record.ano,
      observacoes: record.observacoes || ''
    });
    setEditingId(record._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      aluno: '',
      curso: '',
      data: '',
      status: 'presente',
      semestre: '',
      ano: '',
      observacoes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Frequência</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Adicionar Frequência
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>{editingId ? 'Editar Frequência' : 'Adicionar Frequência'}</h2>
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
                type="date"
                name="data"
                value={formData.data}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                required
              >
                <option value="presente">Presente</option>
                <option value="ausente">Ausente</option>
                <option value="tarde">Atrasado</option>
                <option value="justificado">Justificado</option>
              </select>
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
            <div className="form-group">
              <textarea
                placeholder="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={onChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Atualizar' : 'Adicionar'} Frequência
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
              <th>Data</th>
              <th>Status</th>
              <th>Semestre</th>
              <th>Ano</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {frequencia.map(record => (
              <tr key={record._id}>
                <td>{record.aluno ? record.aluno.nome : 'N/A'}</td>
                <td>{record.curso ? record.curso.titulo : 'N/A'}</td>
                <td>{new Date(record.data).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${
                    record.status === 'presente' ? 'bg-success' : 
                    record.status === 'ausente' ? 'bg-danger' : 
                    record.status === 'tarde' ? 'bg-warning' : 'bg-info'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.semestre}</td>
                <td>{record.ano}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => editFrequencia(record)} style={{ marginRight: '0.5rem' }}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteFrequencia(record._id)}>
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

export default Attendance;
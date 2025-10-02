import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    codigo: '',
    descricao: '',
    creditos: '',
    professor: '',
    horario: [{ dia: '', horaInicio: '', horaFim: '', local: '' }],
    semestre: '',
    ano: ''
  });
  const [professores, setProfessores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCursos();
    fetchProfessores();
  }, []);

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

  const fetchProfessores = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/usuarios', config);
      const professores = res.data.filter(usuario => usuario.papel === 'professor');
      setProfessores(professores);
    } catch (err) {
      console.error('Erro ao buscar professores:', err);
    }
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onHorarioChange = (index, field, value) => {
    const novoHorario = [...formData.horario];
    novoHorario[index][field] = value;
    setFormData({
      ...formData,
      horario: novoHorario
    });
  };

  const addHorarioRow = () => {
    setFormData({
      ...formData,
      horario: [...formData.horario, { dia: '', horaInicio: '', horaFim: '', local: '' }]
    });
  };

  const removeHorarioRow = (index) => {
    if (formData.horario.length > 1) {
      const novoHorario = [...formData.horario];
      novoHorario.splice(index, 1);
      setFormData({
        ...formData,
        horario: novoHorario
      });
    }
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

      if (editingId) {
        await axios.put(`/api/cursos/${editingId}`, formData, config);
      } else {
        await axios.post('/api/cursos', formData, config);
      }

      fetchCursos();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar curso:', err);
      alert(err.response?.data?.msg || 'Erro ao salvar curso');
    }
  };

  const deleteCurso = async id => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`/api/cursos/${id}`, config);
        fetchCursos();
      } catch (err) {
        console.error('Erro ao excluir curso:', err);
        alert('Erro ao excluir curso');
      }
    }
  };

  const editCurso = curso => {
    setFormData({
      titulo: curso.titulo,
      codigo: curso.codigo,
      descricao: curso.descricao || '',
      creditos: curso.creditos,
      professor: curso.professor._id,
      horario: curso.horario || [{ dia: '', horaInicio: '', horaFim: '', local: '' }],
      semestre: curso.semestre,
      ano: curso.ano
    });
    setEditingId(curso._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      codigo: '',
      descricao: '',
      creditos: '',
      professor: '',
      horario: [{ dia: '', horaInicio: '', horaFim: '', local: '' }],
      semestre: '',
      ano: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Cursos</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Adicionar Curso
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>{editingId ? 'Editar Curso' : 'Adicionar Curso'}</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Título do Curso"
                name="titulo"
                value={formData.titulo}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Código do Curso"
                name="codigo"
                value={formData.codigo}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Créditos"
                name="creditos"
                value={formData.creditos}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <select
                name="professor"
                value={formData.professor}
                onChange={onChange}
                required
              >
                <option value="">Selecione o Professor</option>
                {professores.map(professor => (
                  <option key={professor._id} value={professor._id}>
                    {professor.nome} ({professor.email})
                  </option>
                ))}
              </select>
            </div>
            
            <h3>Horário</h3>
            {formData.horario.map((horario, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select
                  value={horario.dia}
                  onChange={e => onHorarioChange(index, 'dia', e.target.value)}
                  required
                >
                  <option value="">Dia</option>
                  <option value="Segunda">Segunda</option>
                  <option value="Terça">Terça</option>
                  <option value="Quarta">Quarta</option>
                  <option value="Quinta">Quinta</option>
                  <option value="Sexta">Sexta</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
                <input
                  type="time"
                  value={horario.horaInicio}
                  onChange={e => onHorarioChange(index, 'horaInicio', e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={horario.horaFim}
                  onChange={e => onHorarioChange(index, 'horaFim', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Local"
                  value={horario.local}
                  onChange={e => onHorarioChange(index, 'local', e.target.value)}
                />
                {formData.horario.length > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm" 
                    onClick={() => removeHorarioRow(index)}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-primary btn-sm" onClick={addHorarioRow}>
              Adicionar Horário
            </button>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
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
              {editingId ? 'Atualizar' : 'Adicionar'} Curso
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
              <th>Título</th>
              <th>Código</th>
              <th>Professor</th>
              <th>Créditos</th>
              <th>Semestre</th>
              <th>Ano</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso._id}>
                <td>{curso.titulo}</td>
                <td>{curso.codigo}</td>
                <td>{curso.professor ? curso.professor.nome : 'N/A'}</td>
                <td>{curso.creditos}</td>
                <td>{curso.semestre}</td>
                <td>{curso.ano}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => editCurso(curso)} style={{ marginRight: '0.5rem' }}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteCurso(curso._id)}>
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

export default Courses;
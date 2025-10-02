import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [alunos, setAlunos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    dataNascimento: '',
    genero: '',
    endereco: { rua: '', cidade: '', estado: '', cep: '' },
    responsavel: { nome: '', telefone: '', email: '' },
    status: 'ativo'
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAlunos();
  }, []);

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

  const onChange = e => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
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
        await axios.put(`/api/alunos/${editingId}`, formData, config);
      } else {
        await axios.post('/api/alunos', formData, config);
      }

      fetchAlunos();
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar aluno:', err);
      alert(err.response?.data?.msg || 'Erro ao salvar aluno');
    }
  };

  const deleteAluno = async id => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`/api/alunos/${id}`, config);
        fetchAlunos();
      } catch (err) {
        console.error('Erro ao excluir aluno:', err);
        alert('Erro ao excluir aluno');
      }
    }
  };

  const editAluno = aluno => {
    setFormData({
      nome: aluno.nome,
      email: aluno.email,
      matricula: aluno.matricula,
      dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.substring(0, 10) : '',
      genero: aluno.genero || '',
      endereco: aluno.endereco || { rua: '', cidade: '', estado: '', cep: '' },
      responsavel: aluno.responsavel || { nome: '', telefone: '', email: '' },
      status: aluno.status || 'ativo'
    });
    setEditingId(aluno._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      matricula: '',
      dataNascimento: '',
      genero: '',
      endereco: { rua: '', cidade: '', estado: '', cep: '' },
      responsavel: { nome: '', telefone: '', email: '' },
      status: 'ativo'
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Alunos</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Adicionar Aluno
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>{editingId ? 'Editar Aluno' : 'Adicionar Aluno'}</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome"
                name="nome"
                value={formData.nome}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Matrícula"
                name="matricula"
                value={formData.matricula}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="Data de Nascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <select
                name="genero"
                value={formData.genero}
                onChange={onChange}
              >
                <option value="">Selecione o Gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Rua"
                name="endereco.rua"
                value={formData.endereco.rua}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Cidade"
                name="endereco.cidade"
                value={formData.endereco.cidade}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Estado"
                name="endereco.estado"
                value={formData.endereco.estado}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="CEP"
                name="endereco.cep"
                value={formData.endereco.cep}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome do Responsável"
                name="responsavel.nome"
                value={formData.responsavel.nome}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Telefone do Responsável"
                name="responsavel.telefone"
                value={formData.responsavel.telefone}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email do Responsável"
                name="responsavel.email"
                value={formData.responsavel.email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="formado">Formado</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Atualizar' : 'Adicionar'} Aluno
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
              <th>Nome</th>
              <th>Email</th>
              <th>Matrícula</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map(aluno => (
              <tr key={aluno._id}>
                <td>{aluno.nome}</td>
                <td>{aluno.email}</td>
                <td>{aluno.matricula}</td>
                <td><span className={`badge ${aluno.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>{aluno.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => editAluno(aluno)} style={{ marginRight: '0.5rem' }}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteAluno(aluno._id)}>
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

export default Students;
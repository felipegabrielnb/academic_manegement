const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  matricula: {
    type: String,
    required: true,
    unique: true
  },
  dataNascimento: {
    type: Date
  },
  genero: {
    type: String,
    enum: ['masculino', 'feminino', 'outro']
  },
  endereco: {
    rua: String,
    cidade: String,
    estado: String,
    cep: String
  },
  responsavel: {
    nome: String,
    telefone: String,
    email: String
  },
  dataMatricula: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'formado'],
    default: 'ativo'
  },
  cursos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso'
  }],
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Aluno', AlunoSchema);
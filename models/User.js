const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  papel: {
    type: String,
    enum: ['admin', 'professor', 'aluno'],
    default: 'professor'
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
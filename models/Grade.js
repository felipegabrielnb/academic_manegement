const mongoose = require('mongoose');

const NotaSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    required: true
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  nomeAvaliacao: {
    type: String,
    required: true
  },
  nota: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pontosMaximos: {
    type: Number,
    default: 100
  },
  data: {
    type: Date,
    default: Date.now
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  semestre: {
    type: String,
    required: true
  },
  ano: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Nota', NotaSchema);
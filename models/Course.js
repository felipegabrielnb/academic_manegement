const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  descricao: {
    type: String
  },
  creditos: {
    type: Number,
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  alunos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno'
  }],
  horario: [{
    dia: {
      type: String,
      required: true
    },
    horaInicio: {
      type: String,
      required: true
    },
    horaFim: {
      type: String,
      required: true
    },
    local: String
  }],
  semestre: {
    type: String,
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Curso', CursoSchema);
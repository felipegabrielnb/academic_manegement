const mongoose = require('mongoose');

const FrequenciaSchema = new mongoose.Schema({
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
  data: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['presente', 'ausente', 'tarde', 'justificado'],
    required: true
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
  },
  observacoes: String,
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Frequencia', FrequenciaSchema);
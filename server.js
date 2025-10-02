const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gerenciamento_academico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log('Erro na conexão com o MongoDB:', err));

// Rotas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/autenticacao', require('./routes/autenticacao'));
app.use('/api/alunos', require('./routes/alunos'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/notas', require('./routes/notas'));
app.use('/api/frequencia', require('./routes/frequencia'));

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  // Definir pasta estática
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
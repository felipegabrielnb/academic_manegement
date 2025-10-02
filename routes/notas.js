const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Nota = require('../models/Grade');

// @route    GET api/notas
// @desc     Obter todas as notas
// @access   Privado
router.get('/', auth, async (req, res) => {
  try {
    const notas = await Nota.find()
      .populate('aluno', ['nome', 'email', 'matricula'])
      .populate('curso', ['titulo', 'codigo'])
      .populate('professor', ['nome', 'email'])
      .sort({ data: -1 });
    res.json(notas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    GET api/notas/aluno/:alunoId
// @desc     Obter notas para um aluno específico
// @access   Privado
router.get('/aluno/:alunoId', auth, async (req, res) => {
  try {
    const notas = await Nota.find({ aluno: req.params.alunoId })
      .populate('aluno', ['nome', 'email', 'matricula'])
      .populate('curso', ['titulo', 'codigo'])
      .populate('professor', ['nome', 'email'])
      .sort({ data: -1 });
    
    res.json(notas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    GET api/notas/curso/:cursoId
// @desc     Obter notas para um curso específico
// @access   Privado
router.get('/curso/:cursoId', auth, async (req, res) => {
  try {
    const notas = await Nota.find({ curso: req.params.cursoId })
      .populate('aluno', ['nome', 'email', 'matricula'])
      .populate('curso', ['titulo', 'codigo'])
      .populate('professor', ['nome', 'email'])
      .sort({ data: -1 });
    
    res.json(notas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    POST api/notas
// @desc     Criar uma nota
// @access   Privado
router.post(
  '/',
  [
    auth,
    [
      check('student', 'Aluno é obrigatório').not().isEmpty(),
      check('course', 'Curso é obrigatório').not().isEmpty(),
      check('assignmentName', 'Nome da avaliação é obrigatório').not().isEmpty(),
      check('grade', 'Nota é obrigatória').isFloat({ min: 0, max: 100 }),
      check('semester', 'Semestre é obrigatório').not().isEmpty(),
      check('year', 'Ano é obrigatório').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      student,
      course,
      assignmentName,
      grade,
      maxPoints,
      teacher,
      semester,
      year
    } = req.body;

    try {
      const novaNota = new Nota({
        aluno: student,
        curso: course,
        nomeAvaliacao: assignmentName,
        nota: grade,
        pontosMaximos: maxPoints,
        professor: teacher,
        semestre: semester,
        ano: year
      });

      const nota = await novaNota.save();

      res.json(nota);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route    PUT api/notas/:id
// @desc     Atualizar uma nota
// @access   Privado
router.put('/:id', auth, async (req, res) => {
  try {
    let nota = await Nota.findById(req.params.id);

    if (!nota) {
      return res.status(404).json({ msg: 'Nota não encontrada' });
    }

    // Atualizar nota
    nota = await Nota.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(nota);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Nota não encontrada' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route    DELETE api/notas/:id
// @desc     Deletar uma nota
// @access   Privado
router.delete('/:id', auth, async (req, res) => {
  try {
    const nota = await Nota.findById(req.params.id);

    if (!nota) {
      return res.status(404).json({ msg: 'Nota não encontrada' });
    }

    await Nota.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Nota removida' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Nota não encontrada' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;
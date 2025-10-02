const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Frequencia = require('../models/Attendance');

// @route    GET api/frequencia
// @desc     Obter todos os registros de frequência
// @access   Privado
router.get('/', auth, async (req, res) => {
  try {
    const frequencia = await Frequencia.find()
      .populate('aluno', ['nome', 'email', 'matricula'])
      .populate('curso', ['titulo', 'codigo'])
      .populate('professor', ['nome', 'email'])
      .sort({ data: -1 });
    res.json(frequencia);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    GET api/frequencia/aluno/:alunoId
// @desc     Obter frequência para um aluno específico
// @access   Privado
router.get('/aluno/:alunoId', auth, async (req, res) => {
  try {
    const frequencia = await Frequencia.find({ aluno: req.params.alunoId })
      .populate('aluno', ['nome', 'email', 'matricula'])
      .populate('curso', ['titulo', 'codigo'])
      .populate('professor', ['nome', 'email'])
      .sort({ data: -1 });
    
    res.json(frequencia);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    GET api/frequencia/curso/:cursoId
// @desc     Obter frequência para um curso específico
// @access   Privado
router.get('/curso/:cursoId', auth, async (req, res) => {
  try {
    const frequencia = await Frequencia.find({ curso: req.params.cursoId })
      .populate('aluno', ['nome', 'email', 'matricula'])
      .populate('curso', ['titulo', 'codigo'])
      .populate('professor', ['nome', 'email'])
      .sort({ data: -1 });
    
    res.json(frequencia);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    POST api/frequencia
// @desc     Criar um registro de frequência
// @access   Privado
router.post(
  '/',
  [
    auth,
    [
      check('student', 'Aluno é obrigatório').not().isEmpty(),
      check('course', 'Curso é obrigatório').not().isEmpty(),
      check('date', 'Data é obrigatória').not().isEmpty(),
      check('status', 'Status é obrigatório').isIn(['presente', 'ausente', 'tarde', 'justificado']),
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
      date,
      status,
      teacher,
      semester,
      year,
      notes
    } = req.body;

    try {
      const novaFrequencia = new Frequencia({
        aluno: student,
        curso: course,
        data: date,
        status,
        professor: teacher,
        semestre: semester,
        ano: year,
        observacoes: notes
      });

      const frequencia = await novaFrequencia.save();

      res.json(frequencia);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route    PUT api/frequencia/:id
// @desc     Atualizar um registro de frequência
// @access   Privado
router.put('/:id', auth, async (req, res) => {
  try {
    let frequencia = await Frequencia.findById(req.params.id);

    if (!frequencia) {
      return res.status(404).json({ msg: 'Registro de frequência não encontrado' });
    }

    // Atualizar frequência
    frequencia = await Frequencia.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(frequencia);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Registro de frequência não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route    DELETE api/frequencia/:id
// @desc     Deletar um registro de frequência
// @access   Privado
router.delete('/:id', auth, async (req, res) => {
  try {
    const frequencia = await Frequencia.findById(req.params.id);

    if (!frequencia) {
      return res.status(404).json({ msg: 'Registro de frequência não encontrado' });
    }

    await Frequencia.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Registro de frequência removido' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Registro de frequência não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;
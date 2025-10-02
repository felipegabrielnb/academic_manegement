const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Curso = require('../models/Course');

// @route    GET api/cursos
// @desc     Obter todos os cursos
// @access   Privado
router.get('/', auth, async (req, res) => {
  try {
    const cursos = await Curso.find().populate('professor', ['nome', 'email']).sort({ data: -1 });
    res.json(cursos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    GET api/cursos/:id
// @desc     Obter curso por ID
// @access   Privado
router.get('/:id', auth, async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('professor', ['nome', 'email']).populate('alunos', ['nome', 'email']);

    if (!curso) {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }

    res.json(curso);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route    POST api/cursos
// @desc     Criar um curso
// @access   Privado
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Título é obrigatório').not().isEmpty(),
      check('code', 'Código do curso é obrigatório').not().isEmpty(),
      check('credits', 'Créditos são obrigatórios').isNumeric(),
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
      title,
      code,
      description,
      credits,
      teacher,
      schedule,
      semester,
      year
    } = req.body;

    try {
      const novoCurso = new Curso({
        titulo: title,
        codigo: code,
        descricao: description,
        creditos: credits,
        professor: teacher,
        horario: schedule,
        semestre: semester,
        ano: year
      });

      const curso = await novoCurso.save();

      res.json(curso);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route    PUT api/cursos/:id
// @desc     Atualizar um curso
// @access   Privado
router.put('/:id', auth, async (req, res) => {
  try {
    let curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }

    // Atualizar curso
    curso = await Curso.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(curso);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route    DELETE api/cursos/:id
// @desc     Deletar um curso
// @access   Privado
router.delete('/:id', auth, async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }

    await Curso.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Curso removido' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Aluno = require('../models/Student');

// @route    GET api/alunos
// @desc     Obter todos os alunos
// @access   Privado
router.get('/', auth, async (req, res) => {
  try {
    const alunos = await Aluno.find().sort({ data: -1 });
    res.json(alunos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    GET api/alunos/:id
// @desc     Obter aluno por ID
// @access   Privado
router.get('/:id', auth, async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);

    if (!aluno) {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route    POST api/alunos
// @desc     Criar um aluno
// @access   Privado
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Nome é obrigatório').not().isEmpty(),
      check('email', 'Por favor inclua um email válido').isEmail(),
      check('studentId', 'Matrícula é obrigatória').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      studentId,
      dateOfBirth,
      gender,
      address,
      parentGuardian,
      status
    } = req.body;

    try {
      const novoAluno = new Aluno({
        nome: name,
        email,
        matricula: studentId,
        dataNascimento: dateOfBirth,
        genero: gender,
        endereco: address,
        responsavel: parentGuardian,
        status
      });

      const aluno = await novoAluno.save();

      res.json(aluno);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route    PUT api/alunos/:id
// @desc     Atualizar um aluno
// @access   Privado
router.put('/:id', auth, async (req, res) => {
  try {
    let aluno = await Aluno.findById(req.params.id);

    if (!aluno) {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }

    // Atualizar aluno
    aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(aluno);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

// @route    DELETE api/alunos/:id
// @desc     Deletar um aluno
// @access   Privado
router.delete('/:id', auth, async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);

    if (!aluno) {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }

    await Aluno.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Aluno removido' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Aluno não encontrado' });
    }
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;
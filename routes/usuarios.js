const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Usuario = require('../models/User');

// @route    GET api/usuarios
// @desc     Obter todos os usuários
// @access   Privado
router.get('/', auth, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

// @route    POST api/usuarios
// @desc     Registrar usuário
// @access   Público
router.post(
  '/',
  [
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor inclua um email válido').isEmail(),
    check('password', 'Por favor insira uma senha com 6 ou mais caracteres').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let usuario = await Usuario.findOne({ email });

      if (usuario) {
        return res.status(400).json({ msg: 'Usuário já existe' });
      }

      usuario = new Usuario({
        nome: name,
        email,
        senha: password,
        papel: role
      });

      const salt = await bcrypt.genSalt(10);

      usuario.senha = await bcrypt.hash(password, salt);

      await usuario.save();

      const payload = {
        usuario: {
          id: usuario.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'defaultSecret',
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

module.exports = router;
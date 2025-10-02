const express = require('express');
const router = express.Router();
const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route    POST api/autenticacao
// @desc     Autenticar usuário e obter token
// @access   Público
router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciais Inválidas' });
    }

    const isMatch = await bcrypt.compare(senha, usuario.senha);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais Inválidas' });
    }

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
});

module.exports = router;
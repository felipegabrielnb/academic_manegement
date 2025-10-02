const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obter token do cabeçalho
  const token = req.header('x-auth-token');

  // Verificar se não há token
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');

    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token não é válido' });
  }
};
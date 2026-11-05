const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');
const usuariosRepo = require('../repositories/usuarios.repository');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token de autenticacao nao fornecido', 401));
  }

  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return next(new AppError('Formato de token invalido. Use: Bearer <token>', 401));
  }

  const token = partes[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioBanco = await usuariosRepo.buscaPorID(decoded.id);

    if (!usuarioBanco) {
      return next(new AppError('Usuario do token nao existe mais', 401));
    }

    if (!usuarioBanco.isActive) {
      return next(new AppError('Usuario inativo no sistema', 403));
    }

    req.usuario = {
      id: usuarioBanco.id,
      nome: usuarioBanco.nome,
      email: usuarioBanco.email,
      role: (usuarioBanco.desc || '').toLowerCase()
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    return next(new AppError('Token invalido', 401));
  }
};

const authorize = (...rolesPermitidas) => {
  const rolesNormalizadas = rolesPermitidas.map((r) => r.toLowerCase());
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('Nao autenticado', 401));
    }

    const usuarioRole = (req.usuario.role || '').toLowerCase();
    if (!rolesNormalizadas.includes(usuarioRole)) {
      return next(new AppError('Acesso negado para o perfil: ' + req.usuario.role, 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');

module.exports = (rolesPermitidas = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError('Token de autenticação não fornecido', 401));
    }

    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return next(new AppError('Formato de token inválido. Esperado: Bearer <token>', 401));
    }

    const token = partes[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;

      if (rolesPermitidas.length > 0) {
        const userRole = (req.usuario.role || '').toLowerCase();
        const permitido = rolesPermitidas.map(r => r.toLowerCase()).includes(userRole);

        if (!permitido) {
          return next(new AppError('Acesso não autorizado para o perfil: ' + userRole, 403));
        }
      }

      next();
    } catch (err) {
      return next(new AppError('Sessão expirada ou token inválido', 401));
    }
  };
};
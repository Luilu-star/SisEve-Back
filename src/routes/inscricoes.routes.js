const router = require('express').Router();
const c = require('../controllers/inscricoes.controller');

const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, c.inscrever);
router.delete('/:codInsc', authenticate, c.cancelar);
router.get('/minhas', authenticate, c.listarMinhas);
router.get(
    '/evento/:eventoId',
    authenticate,
    authorize('organizador', 'admin'),
    c.listarPorEvento
);

module.exports = router;
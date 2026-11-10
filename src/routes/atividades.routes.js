const router = require('express').Router();
const c = require('../controllers/atividades.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/evento/:eventoId', c.listarPorEvento);
router.get('/:codAtv', c.obter);
router.post('/', authenticate, authorize('organizador', 'admin'), c.criar);

module.exports = router;
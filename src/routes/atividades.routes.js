const router = require('express').Router();
const c = require('../controllers/atividades.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/evento/:eventoId', c.listarPorEvento);
router.get('/:codAtv', c.obter);
router.post('/', auth(['organizador', 'admin']), c.criar);

module.exports = router;
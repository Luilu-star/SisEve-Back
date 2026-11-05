const router = require('express').Router();
const c = require('../controllers/inscricoes.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth(), c.inscrever);
router.delete('/:codInsc', auth(), c.cancelar);
router.get('/minhas', auth(), c.listarMinhas);
router.get('/evento/:eventoId', auth(['organizador', 'admin']), c.listarPorEvento);

module.exports = router;
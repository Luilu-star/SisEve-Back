const router = require('express').Router();
const c = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/register', c.registrar);
router.post('/login', c.login);
router.get('/me', auth(), c.me);
router.get('/', auth(['admin']), c.listar);
router.get('/active', auth(['admin', 'organizador']), c.listarA);
router.get('/buscar', auth(['admin']), c.buscaE);
router.get('/:id', auth(), c.buscaID);

module.exports = router;
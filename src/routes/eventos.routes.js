const router = require('express').Router();
const c = require('../controllers/eventos.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', c.listar);
router.get('/:id', c.obter);
router.post('/', auth(['organizador', 'admin']), c.criar);
router.put('/:id', auth(['organizador', 'admin']), c.update);
router.delete('/:id', auth(['organizador', 'admin']), c.excluir);

module.exports = router;
const router = require('express').Router();
const c = require('../controllers/presencas.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth(['organizador', 'admin']), c.registrar);
router.get('/', auth(['organizador', 'admin']), c.listar);

module.exports = router;
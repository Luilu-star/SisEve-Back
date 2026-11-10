const router = require('express').Router();
const c = require('../controllers/presencas.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize('organizador', 'admin'), c.registrar);
router.get('/', authenticate, authorize('organizador', 'admin'), c.listar);

module.exports = router;
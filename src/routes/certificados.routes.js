const router = require('express').Router();
const c = require('../controllers/certificados.controller');
const {authenticate, authorize} = require('../middlewares/auth.middleware');

router.post('/gerar', authenticate, authorize('organizador', 'admin'), c.gerar);
router.get('/validar/:codCertif', c.validar);
router.get('/meus', authenticate, authorize('organizador', 'admin'), c.listarMeus);

module.exports = router;
const router = require('express').Router();
const c = require('../controllers/certificados.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/gerar', auth(), c.gerar);
router.get('/validar/:codCertif', c.validar);
router.get('/meus', auth(), c.listarMeus);

module.exports = router;
const router = require('express').Router();
const c = require('../controllers/auth.controller');

router.get('/', c.listar);
router.get('/active', c.listarA);
router.get('/buscar', c.buscaE);
router.get('/verify', c.auth)
router.get('/:id', c.buscaID);  
router.post('/register', c.registrar);

module.exports = router;


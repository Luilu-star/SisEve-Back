const router = require('express').Router();
const c = require('../controllers/auth.controller');
const validate = require('../middlewares/validate')
const schemas = require('../validators/auth.schema')


router.get('/', c.listar);
router.get('/active', c.listarA);
router.get('/buscar', c.buscaE);
router.get('/verify', c.auth)
router.get('/:id', c.buscaID);  
router.post('/register', validate(schemas.registerSchema), c.registrar);

module.exports = router;


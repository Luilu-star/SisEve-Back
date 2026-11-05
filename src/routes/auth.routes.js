const router = require('express').Router();
const c = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/roles');
const {
  registrarSchema,
  loginSchema,
  buscaEmailSchema,
  idParamSchema
} = require('../schemas/auth.schema');

router.post('/register', validate(registrarSchema), c.registrar);
router.post('/login', validate(loginSchema), c.login);

router.get('/me', authenticate, c.me);

router.get('/', authenticate, authorize(ROLES.ADMIN), c.listar);
router.get('/active', authenticate, authorize(ROLES.ADMIN, ROLES.ORGANIZADOR), c.listarA);
router.get('/buscar', authenticate, authorize(ROLES.ADMIN), validate(buscaEmailSchema), c.buscaE);
router.get('/:id', authenticate, authorize(ROLES.ADMIN), validate(idParamSchema), c.buscaID);

module.exports = router;
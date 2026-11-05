const router = require('express').Router();
const c = require('../controllers/eventos.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants/roles');
const {
  criarEventoSchema,
  updateEventoSchema,
  idEventoParamSchema,
  filtroEventoSchema
} = require('../schemas/eventos.schema');

router.get('/', validate(filtroEventoSchema), c.listar);
router.get('/:id', validate(idEventoParamSchema), c.obter);

router.post('/', authenticate, authorize(ROLES.ORGANIZADOR, ROLES.ADMIN), validate(criarEventoSchema), c.criar);
router.put('/:id', authenticate, authorize(ROLES.ORGANIZADOR, ROLES.ADMIN), validate(updateEventoSchema), c.update);
router.delete('/:id', authenticate, authorize(ROLES.ORGANIZADOR, ROLES.ADMIN), validate(idEventoParamSchema), c.excluir);

module.exports = router;
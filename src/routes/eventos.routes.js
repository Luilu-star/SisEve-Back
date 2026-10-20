const router = require('express').Router();
const c = require('../controllers/eventos.controller');

router.get('/', c.listar);
router.get('/:id', c.obter);
router.post('/', c.criar); // depois: auth + role('organizador','admin')
router.put('/:id', c.update);

module.exports = router;
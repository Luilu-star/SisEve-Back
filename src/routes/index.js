const router = require('express').Router();
router.use('/eventos', require('./eventos.routes'));
router.use('/auth', require('./auth.routes'));
module.exports = router;
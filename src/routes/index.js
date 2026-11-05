const router = require('express').Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    servico: 'SisEve-Back API'
  });
});

router.use('/auth', require('./auth.routes'));
router.use('/eventos', require('./eventos.routes'));

module.exports = router;
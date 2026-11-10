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
router.use('/inscricoes', require('./inscricoes.routes'));
router.use('/atividades', require('./atividades.routes'));
router.use('/presencas', require('./presencas.routes'));
router.use('/certificados', require('./certificados.routes'));

module.exports = router;
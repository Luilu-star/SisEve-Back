module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    console.error('[ERRO INTERNO]:', err);
  }
  res.status(status).json({
    sucesso: false,
    erro: status === 500 ? 'Erro interno no servidor' : err.message
  });
};
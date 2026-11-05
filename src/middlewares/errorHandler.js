module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let mensagem = err.message || 'Erro interno no servidor';
  const detalhes = err.details || null;

  if (err.code === '23505') {
    status = 409;
    mensagem = 'Registro duplicado: o dado informado ja existe no banco de dados';
  } else if (err.code === '23503') {
    status = 400;
    mensagem = 'Violacao de chave estrangeira: registro relacionado nao existe';
  } else if (err.code === '22P02') {
    status = 400;
    mensagem = 'Formato de dado invalido para o banco de dados';
  }

  if (err.name === 'JsonWebTokenError') {
    status = 401;
    mensagem = 'Token JWT invalido';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    mensagem = 'Token JWT expirado';
  }

  if (status === 500) {
    console.error('[ERRO FATAL]:', err);
    mensagem = process.env.NODE_ENV === 'production'
      ? 'Erro interno no servidor'
      : (err.message || 'Erro interno no servidor');
  }

  res.status(status).json({
    sucesso: false,
    erro: mensagem,
    ...(detalhes && { detalhes })
  });
};
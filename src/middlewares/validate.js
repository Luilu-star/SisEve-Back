import AppError from '../helpers/AppError.js';

export default (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    const mensagem = resultado.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    return next(new AppError(mensagem, 400));
  }

  req.body = resultado.data;
  next();
};


const AppError = require('../helpers/AppError');

module.exports = (schema) => (req, res, next) => {
  const payload = {};
  if (schema.shape && schema.shape.body) payload.body = req.body ?? {};
  if (schema.shape && schema.shape.query) payload.query = req.query ?? {};
  if (schema.shape && schema.shape.params) payload.params = req.params ?? {};

  const result = schema.safeParse(payload);

  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const detalhes = issues.map((issue) => ({
      campo: issue.path.join('.').replace(/^(body|query|params)\./, ''),
      mensagem: issue.message
    }));
    return next(new AppError('Dados invalidos', 422, detalhes));
  }

  req.validated = result.data;
  if (result.data.body !== undefined) req.body = result.data.body;
  if (result.data.query !== undefined) req.query = result.data.query;
  if (result.data.params !== undefined) req.params = result.data.params;

  next();
};
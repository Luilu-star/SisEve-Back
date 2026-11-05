const service = require('../services/presencas.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.registrar = asyncHandler(async (req, res) => {
  res.status(201).json(await service.registrar(req.body));
});

exports.listar = asyncHandler(async (req, res) => {
  const { eventoId, codAtv } = req.query;
  res.json(await service.listarFrequencia(eventoId, codAtv));
});
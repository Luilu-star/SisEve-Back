const service = require('../services/atividades.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.criar = asyncHandler(async (req, res) => {
  res.status(201).json(await service.criar(req.body));
});

exports.listarPorEvento = asyncHandler(async (req, res) => {
  res.json(await service.listarPorEvento(req.params.eventoId));
});

exports.obter = asyncHandler(async (req, res) => {
  res.json(await service.buscarPorId(req.params.codAtv));
});
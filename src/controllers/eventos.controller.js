const service = require('../services/eventos.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.listar = asyncHandler(async (req, res) => {
  res.json(await service.listar());
});

exports.obter = asyncHandler(async (req, res) => {
  res.json(await service.obter(req.params.id));
});

exports.criar = asyncHandler(async (req, res) => {
  res.status(201).json(await service.criar(req.body));
});

exports.update = asyncHandler(async (req, res) => {
  res.status(200).json(await service.update(req.params.id, req.body));
});
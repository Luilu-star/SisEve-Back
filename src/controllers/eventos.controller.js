const service = require('../services/eventos.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.listar = asyncHandler(async (req, res) => {
  res.status(200).json(await service.listar(req.query || {}));
});

exports.obter = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  res.status(200).json(await service.obter(id));
});

exports.criar = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario ? req.usuario.id : null;
  res.status(201).json(await service.criar(req.body, usuarioId));
});

exports.update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const usuarioId = req.usuario ? req.usuario.id : null;
  res.status(200).json(await service.update(id, req.body, usuarioId));
});

exports.excluir = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  res.status(200).json(await service.excluir(id));
});
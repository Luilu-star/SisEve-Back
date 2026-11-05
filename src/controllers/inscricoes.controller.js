const service = require('../services/inscricoes.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.inscrever = asyncHandler(async (req, res) => {
  const { eventoId } = req.body;
  res.status(201).json(await service.inscrever(req.usuario.id, eventoId));
});

exports.cancelar = asyncHandler(async (req, res) => {
  res.json(await service.cancelar(req.usuario.id, req.params.codInsc, req.usuario.role));
});

exports.listarMinhas = asyncHandler(async (req, res) => {
  res.json(await service.listarMinhas(req.usuario.id));
});

exports.listarPorEvento = asyncHandler(async (req, res) => {
  res.json(await service.listarPorEvento(req.params.eventoId));
});
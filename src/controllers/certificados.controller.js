const service = require('../services/certificados.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.gerar = asyncHandler(async (req, res) => {
  const { eventoId, codAtv } = req.body;
  res.status(201).json(await service.gerar(req.usuario.id, eventoId, codAtv));
});

exports.validar = asyncHandler(async (req, res) => {
  res.json(await service.validar(req.params.codCertif));
});

exports.listarMeus = asyncHandler(async (req, res) => {
  res.json(await service.listarMeus(req.usuario.id));
});
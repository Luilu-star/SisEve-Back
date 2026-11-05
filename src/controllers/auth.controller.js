const service = require('../services/auth.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.listar = asyncHandler(async (req, res) => {
  res.status(200).json(await service.listar());
});

exports.listarA = asyncHandler(async (req, res) => {
  res.status(200).json(await service.listarAtivos());
});

exports.buscaE = asyncHandler(async (req, res) => {
  const email = (req.query && req.query.email) || '';
  res.status(200).json(await service.buscaEmail(email));
});

exports.buscaID = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  res.status(200).json(await service.buscaID(id));
});

exports.registrar = asyncHandler(async (req, res) => {
  res.status(201).json(await service.registrar(req.body));
});

exports.login = asyncHandler(async (req, res) => {
  res.status(200).json(await service.login(req.body));
});

exports.me = asyncHandler(async (req, res) => {
  res.status(200).json(await service.obterPerfilLogado(req.usuario.id));
});
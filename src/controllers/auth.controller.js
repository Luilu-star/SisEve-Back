const service = require('../services/auth.service');
const asyncHandler = require('../helpers/asyncHandler');

exports.listar = asyncHandler(async (req, res) => {
    res.json(await service.listar());
})

exports.listarA = asyncHandler(async (req, res) => {
    res.json(await service.listarAtivos());
})

exports.buscaE = asyncHandler(async (req, res) => {
    res.json(await service.buscaEmail(req.query.email)
    )
})

exports.buscaID = asyncHandler(async (req, res) => {
    res.json(await service.buscaID(req.params.id)
    )
})

exports.registrar = asyncHandler(async (req, res) => {
  res.status(201).json(await service.registrar(req.body));
});

exports.auth = asyncHandler(async (req, res) => {
  res.json(await service.authSenha(req.body));
});
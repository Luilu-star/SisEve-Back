const jwt = require('jsonwebtoken');
const repo = require('../repositories/usuarios.repository');
const AppError = require('../helpers/AppError');

exports.listar = async () => await repo.listar();
exports.listarAtivos = async () => await repo.listarAtivos();

exports.buscaEmail = async (email) => {
  const user = await repo.buscaPorEmail(email);
  if (!user) {
    throw new AppError('Usuario nao encontrado com o e-mail informado', 404);
  }
  const { senha, ...userSemSenha } = user;
  return userSemSenha;
};

exports.buscaID = async (id) => {
  const user = await repo.buscaPorID(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado com o ID informado', 404);
  }
  return user;
};

exports.registrar = async (dados) => {
  const emailExistente = await repo.buscaPorEmail(dados.email);
  if (emailExistente) {
    throw new AppError('E-mail ja cadastrado', 409);
  }

  const cpfExistente = await repo.buscaPorCPF(dados.cpf);
  if (cpfExistente) {
    throw new AppError('CPF ja cadastrado', 409);
  }

  return await repo.registrar(dados);
};

exports.login = async ({ email, senha }) => {
  const user = await repo.buscaPorEmail(email);

  if (!user) {
    throw new AppError('Credenciais invalidas', 401);
  }

  if (!user.isActive) {
    throw new AppError('Conta inativa. Contate o administrador', 403);
  }

  const senhaCorreta = await repo.autenticaSenha(email, senha);
  if (!senhaCorreta) {
    throw new AppError('Credenciais invalidas', 401);
  }

  const payload = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: (user.desc || '').toLowerCase()
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });

  return {
    mensagem: 'Login efetuado com sucesso',
    token,
    usuario: payload
  };
};

exports.obterPerfilLogado = async (id) => {
  const user = await repo.buscaPorID(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }
  return user;
};
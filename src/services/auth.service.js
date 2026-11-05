const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const repo = require('../repositories/usuarios.repository');
const AppError = require('../helpers/AppError');

exports.listar = async () => await repo.listar();
exports.listarAtivos = async () => await repo.listarAtivos();

exports.buscaEmail = async (email) => {
  if (!email) throw new AppError('E-mail não informado', 400);
  const user = await repo.buscaPorEmail(email);
  if (!user) throw new AppError('Usuário não encontrado', 404);
  delete user.senha;
  return user;
};

exports.buscaID = async (id) => {
  const user = await repo.buscaPorID(id);
  if (!user) throw new AppError('Usuário não encontrado', 404);
  return user;
};

exports.registrar = async (dados) => {
  if (!dados.nome || !dados.email || !dados.senha || !dados.cpf) {
    throw new AppError('Campos obrigatórios: nome, email, senha e cpf', 400);
  }
  return await repo.registrar(dados);
};

exports.login = async ({ email, senha }) => {
  if (!email || !senha) throw new AppError('Informe e-mail e senha', 400);

  const user = await repo.buscaPorEmail(email);
  if (!user) throw new AppError('Credenciais inválidas', 401);
  if (!user.isActive) throw new AppError('Usuário desativado. Contate o suporte.', 403);

  const bateu = await bcrypt.compare(senha, user.senha);
  if (!bateu) throw new AppError('Credenciais inválidas', 401);

  const payload = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });

  return {
    mensagem: 'Login realizado com sucesso',
    token,
    usuario: payload
  };
};

exports.me = async (id) => {
  const user = await repo.buscaPorID(id);
  if (!user) throw new AppError('Usuário não encontrado', 404);
  return user;
};
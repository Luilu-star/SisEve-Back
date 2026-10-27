const repo = require('../repositories/usuarios.repository');
const AppError = require('../helpers/AppError');

exports.listar = async () => await repo.listar();

exports.listarAtivos = async () => await repo.listarAtivos();

exports.buscaEmail = async (email) => {
    const user = await repo.buscaPorEmail(email);

    if (!user) throw new AppError('Usuário não encontrado', 404);
  return user;
}

exports.buscaID = async (id) => {
    const user = await repo.buscaPorID(id);

    if (!user) throw new AppError('Usuário não encontrado', 404);
  return user;
}

exports.registrar = (dados) => repo.registrar(dados);

exports.authSenha = async (e) => {

  const user = await repo.buscaPorEmail(e.email);
  
  if (!user) throw new AppError('Usuário não encontrado', 404);
  
  return repo.autenticaSenha(e.email, e.senha);
}

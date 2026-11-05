const repo = require('../repositories/eventos.repository');
const AppError = require('../helpers/AppError');

exports.listar = async (filtros) => await repo.listar(filtros);

exports.obter = async (id) => {
  const evento = await repo.buscarPorId(id);
  if (!evento) throw new AppError('Evento não encontrado', 404);
  return evento;
};

exports.criar = async (dados, usuarioId) => {
  if (!dados.nome || !dados.categoria || !dados.local || !dados.capacidade || !dados.horario || !dados.data) {
    throw new AppError('Dados obrigatórios: nome, categoria, local, capacidade, horario e data.', 400);
  }
  return await repo.criar(dados, usuarioId);
};

exports.update = async (id, dados, usuarioId) => {
  const evento = await repo.buscarPorId(id);
  if (!evento) throw new AppError('Evento não encontrado para atualização', 404);
  return await repo.update(id, dados, usuarioId);
};

exports.excluir = async (id) => {
  const evento = await repo.buscarPorId(id);
  if (!evento) throw new AppError('Evento não encontrado para exclusão', 404);
  await repo.excluir(id);
  return { mensagem: 'Evento e registros associados excluídos com sucesso' };
};
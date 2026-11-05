const repo = require('../repositories/eventos.repository');
const AppError = require('../helpers/AppError');

exports.listar = async (filtros) => await repo.listar(filtros);

exports.obter = async (id) => {
  const evento = await repo.buscarPorId(id);
  if (!evento) {
    throw new AppError('Evento nao encontrado', 404);
  }
  return evento;
};

exports.criar = async (dados, usuarioId) => {
  if (dados.capacidade <= 0) {
    throw new AppError('A capacidade do evento deve ser maior que zero', 400);
  }
  return await repo.criar(dados, usuarioId);
};

exports.update = async (id, dados, usuarioId) => {
  const eventoExistente = await repo.buscarPorId(id);
  if (!eventoExistente) {
    throw new AppError('Evento nao encontrado para atualizacao', 404);
  }

  return await repo.update(id, dados, usuarioId);
};

exports.excluir = async (id) => {
  const eventoExistente = await repo.buscarPorId(id);
  if (!eventoExistente) {
    throw new AppError('Evento nao encontrado para exclusao', 404);
  }

  await repo.excluir(id);
  return { mensagem: 'Evento excluido com sucesso' };
};
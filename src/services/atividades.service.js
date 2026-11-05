const repo = require('../repositories/atividades.repository');
const repoEventos = require('../repositories/eventos.repository');
const AppError = require('../helpers/AppError');

exports.criar = async (dados) => {
  if (!dados.titulo || !dados.capacidade || !dados.eventoId) {
    throw new AppError('Informe título, capacidade e eventoId da atividade', 400);
  }
  const evento = await repoEventos.buscarPorId(dados.eventoId);
  if (!evento) throw new AppError('Evento informado não existe', 404);

  return await repo.criar(dados);
};

exports.listarPorEvento = async (eventoId) => await repo.listarPorEvento(eventoId);
exports.buscarPorId = async (codAtv) => {
  const atv = await repo.buscarPorId(codAtv);
  if (!atv) throw new AppError('Atividade não encontrada', 404);
  return atv;
};
const repo = require('../repositories/presencas.repository');
const repoInscricoes = require('../repositories/inscricoes.repository');
const repoAtividades = require('../repositories/atividades.repository');
const AppError = require('../helpers/AppError');

// RN009: O responsável não poderá registrar presença para usuários que não estejam inscritos
exports.registrar = async ({ usuarioId, eventoId, codAtv, etapa, isPresente }) => {
  const inscricao = await repoInscricoes.buscarInscricaoAtiva(usuarioId, eventoId);
  if (!inscricao || inscricao.statusInsc !== 1) {
    throw new AppError('Não é permitido registrar presença para usuários sem inscrição confirmada no evento (RN009)', 400);
  }

  const atv = await repoAtividades.buscarPorId(codAtv);
  if (!atv) throw new AppError('Atividade não encontrada', 404);

  return await repo.registrarPresenca({
    usuarioId,
    eventoId,
    codAtv,
    etapa,
    isPresente: Boolean(isPresente)
  });
};

exports.listarFrequencia = async (eventoId, codAtv) => await repo.listarFrequencia(eventoId, codAtv);
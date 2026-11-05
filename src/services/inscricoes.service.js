const repo = require('../repositories/inscricoes.repository');
const repoEventos = require('../repositories/eventos.repository');
const AppError = require('../helpers/AppError');

// Status: 1 = Confirmada, 2 = Fila de espera, 3 = Cancelada (RN001, RN002, RN006)
exports.inscrever = async (usuarioId, eventoId) => {
  const evento = await repoEventos.buscarPorId(eventoId);
  if (!evento) throw new AppError('Evento não encontrado', 404);

  if (!evento.statusEvent) {
    throw new AppError('Este evento está com o período de inscrições encerrado ou cancelado (RN001/RN004)', 400);
  }

  const jaInscrito = await repo.buscarInscricaoAtiva(usuarioId, eventoId);
  if (jaInscrito) {
    const msg = jaInscrito.statusInsc === 1 ? 'Você já está confirmado neste evento' : 'Você já está na lista de espera deste evento';
    throw new AppError(msg, 409);
  }

  const vagasOcupadas = await repo.contarConfirmadas(eventoId);
  let statusInsc = 1;
  let statusTexto = 'Inscrição Confirmada';

  if (vagasOcupadas >= evento.capacidade) {
    statusInsc = 2; // Fila de espera
    statusTexto = 'Vagas esgotadas. Alocado na Lista de Espera (RF-006 / RN002)';
  }

  const inscricao = await repo.criar({ usuarioId, eventoId, statusInsc });

  return {
    mensagem: statusTexto,
    comprovanteInscricao: `IFCE-CEDRO-${inscricao.codInsc}-${eventoId}`,
    inscricao
  };
};

exports.cancelar = async (usuarioId, codInsc, perfilUsuario) => {
  const inscricao = await repo.buscarPorId(codInsc);
  if (!inscricao) throw new AppError('Inscrição não encontrada', 404);

  // Apenas o próprio usuário ou admin/organizador pode cancelar
  if (inscricao.Usuario_ID !== usuarioId && perfilUsuario !== 'admin' && perfilUsuario !== 'organizador') {
    throw new AppError('Você não tem permissão para cancelar esta inscrição', 403);
  }

  if (inscricao.statusInsc === 3) {
    throw new AppError('Esta inscrição já está cancelada', 400);
  }

  const eraConfirmada = inscricao.statusInsc === 1;

  // Atualiza para cancelada (status 3)
  const cancelada = await repo.atualizarStatus(codInsc, 3);

  let promovido = null;
  // RN006: Se liberou vaga, promove o primeiro da fila de espera
  if (eraConfirmada) {
    const primeiroFila = await repo.obterPrimeiroFila(inscricao.Evento_ID);
    if (primeiroFila) {
      promovido = await repo.atualizarStatus(primeiroFila.codInsc, 1);
    }
  }

  return {
    mensagem: 'Inscrição cancelada com sucesso',
    inscricao: cancelada,
    vagaRepassadaPara: promovido ? { codInsc: promovido.codInsc, usuarioId: promovido.Usuario_ID } : null
  };
};

exports.listarMinhas = async (usuarioId) => await repo.listarPorUsuario(usuarioId);
exports.listarPorEvento = async (eventoId) => await repo.listarPorEvento(eventoId);
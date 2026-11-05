const repo = require('../repositories/certificados.repository');
const repoPresenca = require('../repositories/presencas.repository');
const repoInscricoes = require('../repositories/inscricoes.repository');
const AppError = require('../helpers/AppError');

// RN007: O participante só poderá receber certificado se sua presença for confirmada
// RN008: Certificado utiliza dados registrados no evento sem alteração
exports.gerar = async (usuarioId, eventoId, codAtv) => {
  const inscricao = await repoInscricoes.buscarInscricaoAtiva(usuarioId, eventoId);
  if (!inscricao) throw new AppError('Inscrição não encontrada para este participante', 404);

  const presenca = await repoPresenca.verificarPresenca(usuarioId, eventoId, codAtv);
  if (!presenca) {
    throw new AppError('Certificado não disponível: presença não confirmada nesta atividade (RN007)', 400);
  }

  const jaEmitido = await repo.buscarExistente(usuarioId, eventoId, codAtv);
  if (jaEmitido) {
    return await repo.buscarCompletoPorId(jaEmitido.codCertif);
  }

  const dataEmissao = new Date().toLocaleDateString('pt-BR');
  const certificado = await repo.emitir({
    dataEmissao,
    codAtv,
    codInsc: inscricao.codInsc,
    eventoId,
    usuarioId
  });

  return await repo.buscarCompletoPorId(certificado.codCertif);
};

exports.validar = async (codCertif) => {
  const cert = await repo.buscarCompletoPorId(codCertif);
  if (!cert) throw new AppError('Certificado não encontrado ou inválido', 404);
  return cert;
};

exports.listarMeus = async (usuarioId) => await repo.listarPorUsuario(usuarioId);
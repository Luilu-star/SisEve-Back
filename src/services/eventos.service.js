const repo = require('../repositories/eventos.repository');
const AppError = require('../helpers/AppError');

exports.listar = () => repo.listar();

exports.obter = async (id) => {
  const evento = await repo.buscarPorId(id);
  if (!evento) throw new AppError('Evento não encontrado', 404);
  return evento;
};

exports.criar = (dados) => repo.criar(dados); // regras de negócio entram aqui

exports.update = async (id, dados) =>  {

  const evento = await repo.buscarPorId(id);

  if (!evento) {
    throw new AppError('Evento não encontrado', 404);
  }

  return await repo.update(id, dados);
  
}
const ROLES = Object.freeze({
  ADMIN: 'admin',
  ORGANIZADOR: 'organizador',
  ALUNO: 'aluno'
});

const ROLES_LISTA = Object.values(ROLES);

module.exports = {
  ROLES,
  ROLES_LISTA
};
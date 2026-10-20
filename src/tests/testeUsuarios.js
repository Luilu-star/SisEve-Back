
import repo from '../repositories/usuarios.repository.js';

console.log(await repo.buscaPorEmail("ana.costa@ifce.edu.br"));
console.log(await repo.buscaPorID(2));


require('dotenv').config();
const { ROLES } = require('../constants/roles');
const { registrarSchema, loginSchema } = require('../schemas/auth.schema');
const { criarEventoSchema } = require('../schemas/eventos.schema');

let totalTestes = 0;
let aprovados = 0;

function assertEqual(descricao, obtido, esperado) {
  totalTestes++;
  if (obtido === esperado) {
    console.log('[PASS] ' + descricao);
    aprovados++;
  } else {
    console.error('[FAIL] ' + descricao);
    console.error('       Esperado: ' + esperado + ' | Obtido: ' + obtido);
  }
}

function assertThrows(descricao, fn) {
  totalTestes++;
  try {
    fn();
    console.error('[FAIL] ' + descricao + ' (Deveria ter falhado)');
  } catch (err) {
    console.log('[PASS] ' + descricao);
    aprovados++;
  }
}

console.log('--- TESTES DE INTEGRIDADE E VALIDACAO SISEVE ---');

assertEqual('ROLES.ADMIN deve ser admin', ROLES.ADMIN, 'admin');
assertEqual('ROLES.ORGANIZADOR deve ser organizador', ROLES.ORGANIZADOR, 'organizador');
assertEqual('ROLES.ALUNO deve ser aluno', ROLES.ALUNO, 'aluno');

assertThrows('Login sem email deve falhar', () => {
  loginSchema.parse({ body: { senha: '123' } });
});

assertThrows('Login com email invalido deve falhar', () => {
  loginSchema.parse({ body: { email: 'email_invalido', senha: '123' } });
});

const loginOk = loginSchema.parse({ body: { email: 'TESTE@IFCE.EDU.BR', senha: '123' } });
assertEqual('Login normaliza email para minusculas', loginOk.body.email, 'teste@ifce.edu.br');

assertThrows('Registro com CPF com menos de 11 digitos deve falhar', () => {
  registrarSchema.parse({
    body: {
      nome: 'Usuario',
      email: 'teste@ifce.edu.br',
      senha: 'senhaSegura123',
      cpf: '12345',
      desc: 'aluno',
      key: '202410310205'
    }
  });
});

assertThrows('Registro de Admin sem adminCode deve falhar', () => {
  registrarSchema.parse({
    body: {
      nome: 'Admin Teste',
      email: 'admin@ifce.edu.br',
      senha: 'senhaSegura123',
      cpf: '12345678901',
      desc: 'admin',
      key: '202410314205'
    }
  });
});

const adminOk = registrarSchema.parse({
  body: {
    nome: 'Admin Teste',
    email: 'admin@ifce.edu.br',
    senha: 'senhaSegura123',
    cpf: '12345678901',
    desc: 'admin',
    key: '202410314205',
    adminCode: 'codigo_admin_teste'
  }
});
assertEqual('Registro de Admin com adminCode passa', adminOk.body.desc, 'admin');

assertThrows('Evento com capacidade negativa deve falhar', () => {
  criarEventoSchema.parse({
    body: {
      nome: 'Semana de TI',
      categoria: 'Academico',
      local: 'Auditorio',
      capacidade: -10,
      horario: '10:00',
      data: '2026-11-20'
    }
  });
});

const eventoOk = criarEventoSchema.parse({
  body: {
    nome: 'Semana de TI',
    categoria: 'Academico',
    local: 'Auditorio',
    capacidade: 100,
    horario: '10:00',
    data: '2026-11-20'
  }
});
assertEqual('Evento valido recebe statusEvent=true por default', eventoOk.body.statusEvent, true);

console.log('------------------------------------------------');
console.log('TOTAL: ' + totalTestes + ' | APROVADOS: ' + aprovados + ' | FALHAS: ' + (totalTestes - aprovados));

if (aprovados !== totalTestes) {
  process.exit(1);
}
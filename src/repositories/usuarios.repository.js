const pool = require('../config/db');
const bcrypt = require('bcrypt');
const AppError = require('../helpers/AppError');
const { ROLES } = require('../constants/roles');

exports.listar = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.nome, u.email, u.cpf, u."isActive", tu."desc", tu."key"
    FROM Usuarios u
    INNER JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
    ORDER BY u.id ASC;
  `);
  return rows;
};

exports.listarAtivos = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.nome, u.email, u.cpf, u."isActive", tu."desc", tu."key"
    FROM Usuarios u
    INNER JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
    WHERE u."isActive" = true
    ORDER BY u.id ASC;
  `);
  return rows;
};

exports.buscaPorEmail = async (email) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.nome, u.email, u.senha, u.cpf, u."isActive", tu."desc", tu."key"
    FROM Usuarios u
    INNER JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
    WHERE LOWER(u.email) = LOWER($1);
  `, [email]);
  return rows[0] || null;
};

exports.buscaPorID = async (id) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.nome, u.email, u.cpf, u."isActive", tu."desc", tu."key"
    FROM Usuarios u
    INNER JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
    WHERE u.id = $1;
  `, [id]);
  return rows[0] || null;
};

exports.buscaPorCPF = async (cpf) => {
  const { rows } = await pool.query(`
    SELECT id FROM Usuarios WHERE cpf = $1;
  `, [cpf]);
  return rows[0] || null;
};

exports.registrar = async (dados) => {
  const client = await pool.connect();
  const emailTratado = dados.email.trim().toLowerCase();
  const descTratado = dados.desc.trim().toLowerCase();
  const isActiveFinal = dados.isActive !== undefined ? Boolean(dados.isActive) : true;

  if (descTratado === ROLES.ADMIN && dados.adminCode !== process.env.ADMIN_CODE) {
    client.release();
    throw new AppError('Codigo de administrador incorreto', 403);
  }

  const saltRounds = 10;
  const senhaCripto = await bcrypt.hash(dados.senha, saltRounds);

  try {
    await client.query('BEGIN');

    const usuarioRes = await client.query(`
      INSERT INTO Usuarios ("nome", "email", "senha", "cpf", "isActive")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, cpf, "isActive";
    `, [dados.nome.trim(), emailTratado, senhaCripto, dados.cpf.trim(), isActiveFinal]);

    const novo = usuarioRes.rows[0];

    await client.query(`
      INSERT INTO tipo_usuario ("Usuario_ID", "desc", "key")
      VALUES ($1, $2, $3);
    `, [novo.id, descTratado, dados.key.trim()]);

    await client.query('COMMIT');

    return {
      id: novo.id,
      nome: novo.nome,
      email: novo.email,
      cpf: novo.cpf,
      isActive: novo.isActive,
      role: descTratado
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.autenticaSenha = async (email, senha) => {
  const { rows } = await pool.query(`
    SELECT senha FROM Usuarios WHERE LOWER(email) = LOWER($1);
  `, [email]);

  if (!rows[0] || !rows[0].senha) {
    return false;
  }

  return await bcrypt.compare(senha, rows[0].senha);
};
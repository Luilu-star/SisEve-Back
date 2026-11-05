const pool = require('../config/db');
const bcrypt = require('bcrypt');
const AppError = require('../helpers/AppError');

exports.listar = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.nome, u.email, u.cpf, u."isActive", tu."desc" AS role, tu.key
    FROM Usuarios u
    LEFT JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
    ORDER BY u.id
  `);
  return rows;
};

exports.listarAtivos = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.nome, u.email, u.cpf, u."isActive", tu."desc" AS role, tu.key
    FROM Usuarios u
    LEFT JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
    WHERE u."isActive" = true
    ORDER BY u.id
  `);
  return rows;
};

exports.buscaPorEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.nome, u.email, u.senha, u.cpf, u."isActive", tu."desc" AS role, tu.key
     FROM Usuarios u
     LEFT JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
     WHERE LOWER(u.email) = LOWER($1);`,
    [email]
  );
  return rows[0];
};

exports.buscaPorID = async (id) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.nome, u.email, u.cpf, u."isActive", tu."desc" AS role, tu.key
     FROM Usuarios u
     LEFT JOIN tipo_usuario tu ON u.id = tu."Usuario_ID"
     WHERE u.id = $1;`,
    [id]
  );
  return rows[0];
};

exports.registrar = async (e) => {
  const client = await pool.connect();
  const email = (e.email || '').trim().toLowerCase();
  const descRole = (e.desc || 'aluno').toLowerCase();
  const isActive = e.isActive !== undefined ? Boolean(e.isActive) : true;

  if (descRole === 'admin' && e.adminCode !== process.env.ADMIN_CODE) {
    client.release();
    throw new AppError('Código de confirmação de administrador inválido', 403);
  }

  const userExistente = await exports.buscaPorEmail(email);
  if (userExistente) {
    client.release();
    throw new AppError('Este e-mail já está cadastrado', 409);
  }

  const saltRounds = 10;
  const senhaCrypto = await bcrypt.hash(e.senha, saltRounds);

  try {
    await client.query('BEGIN');

    const usuarioRes = await client.query(
      `INSERT INTO Usuarios ("nome", "email", "senha", "cpf", "isActive")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, email, "isActive";`,
      [e.nome, email, senhaCrypto, e.cpf, isActive]
    );

    const novo = usuarioRes.rows[0];

    await client.query(
      `INSERT INTO tipo_usuario ("Usuario_ID", "desc", "key")
       VALUES ($1, $2, $3);`,
      [novo.id, descRole, e.key || '']
    );

    await client.query('COMMIT');

    return {
      id: novo.id,
      nome: novo.nome,
      email: novo.email,
      role: descRole
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
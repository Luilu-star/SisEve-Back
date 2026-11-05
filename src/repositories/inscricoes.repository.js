const pool = require('../config/db');

exports.contarConfirmadas = async (eventoId) => {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM Inscricao WHERE "Evento_ID" = $1 AND "statusInsc" = 1',
    [eventoId]
  );
  return rows[0].total;
};

exports.buscarInscricaoAtiva = async (usuarioId, eventoId) => {
  const { rows } = await pool.query(
    'SELECT * FROM Inscricao WHERE "Usuario_ID" = $1 AND "Evento_ID" = $2 AND "statusInsc" IN (1, 2)',
    [usuarioId, eventoId]
  );
  return rows[0];
};

exports.criar = async ({ usuarioId, eventoId, statusInsc }) => {
  const dataInsc = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO Inscricao ("dataInsc", "statusInsc", "Usuario_ID", "Evento_ID")
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [dataInsc, statusInsc, usuarioId, eventoId]
  );
  return rows[0];
};

exports.buscarPorId = async (codInsc) => {
  const { rows } = await pool.query(
    'SELECT * FROM Inscricao WHERE "codInsc" = $1',
    [codInsc]
  );
  return rows[0];
};

exports.atualizarStatus = async (codInsc, statusInsc) => {
  const { rows } = await pool.query(
    'UPDATE Inscricao SET "statusInsc" = $2 WHERE "codInsc" = $1 RETURNING *',
    [codInsc, statusInsc]
  );
  return rows[0];
};

exports.obterPrimeiroFila = async (eventoId) => {
  const { rows } = await pool.query(
    'SELECT * FROM Inscricao WHERE "Evento_ID" = $1 AND "statusInsc" = 2 ORDER BY "codInsc" ASC LIMIT 1',
    [eventoId]
  );
  return rows[0];
};

exports.listarPorUsuario = async (usuarioId) => {
  const { rows } = await pool.query(
    `SELECT i."codInsc", i."dataInsc", i."statusInsc",
            e.id AS evento_id, e.nome AS evento_nome, e.data, e.horario, e.local
     FROM Inscricao i
     JOIN Evento e ON i."Evento_ID" = e.id
     WHERE i."Usuario_ID" = $1
     ORDER BY i."codInsc" DESC`,
    [usuarioId]
  );
  return rows;
};

exports.listarPorEvento = async (eventoId) => {
  const { rows } = await pool.query(
    `SELECT i."codInsc", i."dataInsc", i."statusInsc",
            u.id AS usuario_id, u.nome, u.email, u.cpf
     FROM Inscricao i
     JOIN Usuarios u ON i."Usuario_ID" = u.id
     WHERE i."Evento_ID" = $1
     ORDER BY i."statusInsc" ASC, i."codInsc" ASC`,
    [eventoId]
  );
  return rows;
};
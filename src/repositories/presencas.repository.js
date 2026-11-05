const pool = require('../config/db');

exports.registrarPresenca = async ({ usuarioId, eventoId, codAtv, etapa, isPresente }) => {
  const { rows } = await pool.query(
    `INSERT INTO atividade_presenca ("Usuario_ID", "Evento_ID", "codAtv", "etapa", "isPresente")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [usuarioId, eventoId, codAtv, etapa || 'Geral', isPresente]
  );
  return rows[0];
};

exports.verificarPresenca = async (usuarioId, eventoId, codAtv) => {
  const { rows } = await pool.query(
    `SELECT * FROM atividade_presenca 
     WHERE "Usuario_ID" = $1 AND "Evento_ID" = $2 AND "codAtv" = $3 AND "isPresente" = true`,
    [usuarioId, eventoId, codAtv]
  );
  return rows[0];
};

exports.listarFrequencia = async (eventoId, codAtv) => {
  const { rows } = await pool.query(
    `SELECT ap.*, u.nome, u.email, u.cpf 
     FROM atividade_presenca ap
     JOIN Usuarios u ON ap."Usuario_ID" = u.id
     WHERE ap."Evento_ID" = $1 AND ap."codAtv" = $2`,
    [eventoId, codAtv]
  );
  return rows;
};
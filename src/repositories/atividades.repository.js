const pool = require('../config/db');

exports.criar = async ({ titulo, descricao, capacidade, eventoId }) => {
  const { rows } = await pool.query(
    `INSERT INTO Atividades (titulo, descricao, capacidade, "Evento_ID")
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [titulo, descricao || '', capacidade, eventoId]
  );
  return rows[0];
};

exports.listarPorEvento = async (eventoId) => {
  const { rows } = await pool.query(
    'SELECT * FROM Atividades WHERE "Evento_ID" = $1 ORDER BY "codAtv"',
    [eventoId]
  );
  return rows;
};

exports.buscarPorId = async (codAtv) => {
  const { rows } = await pool.query(
    'SELECT * FROM Atividades WHERE "codAtv" = $1',
    [codAtv]
  );
  return rows[0];
};
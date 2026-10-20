const pool = require('../config/db');

exports.listar = async () => {
  const { rows } = await pool.query('SELECT * FROM Evento ORDER BY id');
  return rows;
};

exports.buscarPorId = async (id) => {
  const { rows } = await pool.query('SELECT * FROM Evento WHERE id = $1', [id]);
  return rows[0];
};

exports.criar = async (e) => {
  const { rows } = await pool.query(
    `INSERT INTO Evento (nome, categoria, local, descricao, capacidade, horario, data)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [e.nome, e.categoria, e.local, e.descricao, e.capacidade, e.horario, e.data]
  );
  return rows[0];
};

exports.update = async ( id, e ) => {
  const { rows } = await pool.query(`
    UPDATE Evento
     SET nome = COALESCE($2, nome),
         categoria = COALESCE($3, categoria),
         local = COALESCE($4, local),
         descricao = COALESCE($5, descricao),
         capacidade = COALESCE($6, capacidade),
         horario = COALESCE($7, horario),
         data = COALESCE($8, data)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      e.nome ?? null,
      e.categoria ?? null,
      e.local ?? null,
      e.descricao ?? null,
      e.capacidade ?? null,
      e.horario ?? null,
      e.data ?? null
    ]);

  return rows;
}
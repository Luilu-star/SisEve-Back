const pool = require('../config/db');

exports.listar = async (filtros = {}) => {
  let query = 'SELECT * FROM Evento WHERE 1=1';
  const params = [];

  if (filtros.categoria) {
    params.push(`%${filtros.categoria}%`);
    query += ` AND categoria ILIKE $${params.length}`;
  }
  if (filtros.nome) {
    params.push(`%${filtros.nome}%`);
    query += ` AND nome ILIKE $${params.length}`;
  }
  if (filtros.data) {
    params.push(filtros.data);
    query += ` AND data = $${params.length}`;
  }

  query += ' ORDER BY id DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};

exports.buscarPorId = async (id) => {
  const { rows } = await pool.query('SELECT * FROM Evento WHERE id = $1', [id]);
  return rows[0];
};

exports.criar = async (e, usuarioId) => {
  const client = await pool.connect();
  const statusEvent = e.statusEvent !== undefined ? Boolean(e.statusEvent) : true;

  try {
    await client.query('BEGIN');

    const resEvento = await client.query(
      `INSERT INTO Evento (nome, categoria, local, descricao, capacidade, horario, data, "statusEvent")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [e.nome, e.categoria, e.local, e.descricao || '', e.capacidade, e.horario, e.data, statusEvent]
    );

    const evento = resEvento.rows[0];

    if (usuarioId) {
      await client.query(
        `INSERT INTO gerencia_evento ("Usuario_ID", "Evento_ID", "updateTime")
         VALUES ($1, $2, $3)`,
        [usuarioId, evento.id, new Date().toISOString()]
      );
    }

    await client.query('COMMIT');
    return evento;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.update = async (id, e, usuarioId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE Evento
       SET nome = COALESCE($2, nome),
           categoria = COALESCE($3, categoria),
           local = COALESCE($4, local),
           descricao = COALESCE($5, descricao),
           capacidade = COALESCE($6, capacidade),
           horario = COALESCE($7, horario),
           data = COALESCE($8, data),
           "statusEvent" = COALESCE($9, "statusEvent")
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
        e.data ?? null,
        e.statusEvent !== undefined ? Boolean(e.statusEvent) : null
      ]
    );

    if (usuarioId && rows[0]) {
      await client.query(
        `INSERT INTO gerencia_evento ("Usuario_ID", "Evento_ID", "updateTime")
         VALUES ($1, $2, $3)`,
        [usuarioId, id, new Date().toISOString()]
      );
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.excluir = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM Evento WHERE id = $1', [id]);
  return rowCount > 0;
};
const pool = require('../config/db');

exports.emitir = async ({ dataEmissao, codAtv, codInsc, eventoId, usuarioId }) => {
  const { rows } = await pool.query(
    `INSERT INTO Certificado ("dataEmissao", "codAtv", "codInsc", "Evento_ID", "Usuario_ID")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [dataEmissao, codAtv, codInsc, eventoId, usuarioId]
  );
  return rows[0];
};

exports.buscarExistente = async (usuarioId, eventoId, codAtv) => {
  const { rows } = await pool.query(
    'SELECT * FROM Certificado WHERE "Usuario_ID" = $1 AND "Evento_ID" = $2 AND "codAtv" = $3',
    [usuarioId, eventoId, codAtv]
  );
  return rows[0];
};

exports.buscarCompletoPorId = async (codCertif) => {
  const { rows } = await pool.query(
    `SELECT c."codCertif", c."dataEmissao",
            u.nome AS participante_nome, u.cpf AS participante_cpf,
            e.nome AS evento_nome, e.data AS evento_data, e.local AS evento_local,
            a.titulo AS atividade_titulo, a.descricao AS atividade_descricao
     FROM Certificado c
     JOIN Usuarios u ON c."Usuario_ID" = u.id
     JOIN Evento e ON c."Evento_ID" = e.id
     JOIN Atividades a ON c."codAtv" = a."codAtv"
     WHERE c."codCertif" = $1`,
    [codCertif]
  );
  return rows[0];
};

exports.listarPorUsuario = async (usuarioId) => {
  const { rows } = await pool.query(
    `SELECT c."codCertif", c."dataEmissao", e.nome AS evento_nome, a.titulo AS atividade_titulo
     FROM Certificado c
     JOIN Evento e ON c."Evento_ID" = e.id
     JOIN Atividades a ON c."codAtv" = a."codAtv"
     WHERE c."Usuario_ID" = $1`,
    [usuarioId]
  );
  return rows;
};
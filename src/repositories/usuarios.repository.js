const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.buscaPorEmail = async (email) => {
    const { rows } = await pool.query(
        `SELECT
            Usuarios.id,
            Usuarios.nome,
            Tipo_Usuario."desc",
            Usuarios.senha,
            Usuarios."isActive"
         FROM Usuarios
         JOIN Tipo_Usuario
           ON Usuarios.id = Tipo_Usuario."Usuario_ID"
         WHERE Usuarios.email = $1;`,
        [email]
    );

    return rows[0];
};

exports.buscaPorID = async (id) => {
    const { rows } = await pool.query(
        `SELECT
            Usuarios.nome,
            Tipo_Usuario."desc"
         FROM Usuarios
         JOIN Tipo_Usuario
           ON Usuarios.id = Tipo_Usuario."Usuario_ID"
         WHERE Usuarios.id = $1;`,
        [id]
    );

    return rows[0];
};

exports.criarUsuario = async (e) => {
    const client = await pool.connect();  

    try {
    await client.query('BEGIN');

    const usuario = await client.query(`INSERT INTO Usuarios ("nome","email", "senha", "cpf", "isActive")
        VALUES ($1,$2,$3,$4,$5) RETURNING id, nome, email;`, [e.nome, e.email , e.senha, e.cpf, e.isActive]);

    await client.query(`INSERT INTO tipo_usuario ("Usuario_ID", "desc", "key")
        VALUES ($1,$2,$3)`, [usuario.rows[0].id, e.desc, e.key]
    );

    await client.query('COMMIT');
    return usuario.rows[0];

    } catch (err) {

    await client.query('ROLLBACK');         
    throw err;          

    } finally {
    client.release();                       
    }
}
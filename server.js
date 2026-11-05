require('dotenv').config();

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error('[ERRO] Variaveis obrigatorias ausentes no .env: ' + missingEnv.join(', '));
  process.exit(1);
}

const app = require('./app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log('[BANCO] Conectado ao PostgreSQL com sucesso.');
  } catch (err) {
    console.warn('[AVISO] Conexao inicial com o banco falhou: ' + err.message);
  }
  console.log('[API] SisEve-Back rodando na porta ' + PORT);
});

process.on('SIGINT', () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
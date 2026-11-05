const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const AppError = require('./src/helpers/AppError');

const app = express();

app.use(helmet());

const origin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: origin === '*' ? '*' : origin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100kb' }));

app.use('/api', routes);

app.use((req, res, next) => {
  next(new AppError('Rota nao encontrada: ' + req.method + ' ' + req.originalUrl, 404));
});

app.use(errorHandler);

module.exports = app;
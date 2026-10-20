# SisEve - Back-end

API do sistema de gestão de eventos do IFCE Campus Cedro. Permite cadastrar eventos, inscrever participantes, controlar presença e emitir certificados.

Projeto da disciplina Laboratório de Desenvolvimento de Software.

## Tecnologias

Node.js, Express, PostgreSQL (Neon), JWT e bcrypt.

## Como rodar

```bash
git clone <url-do-repositorio>
cd SisEve-Back
npm install
npm start
```

Crie um arquivo `.env` na raiz:

```env
PORT=3000
DATABASE_URL=sua_string_de_conexao_do_neon
JWT_SECRET=um_segredo_longo
JWT_EXPIRES_IN=2h
ADMIN_CODE=codigo_para_cadastrar_admin
```

As tabelas são criadas com o script SQL da documentação do projeto.

## Estrutura

```
server.js        sobe o servidor
app.js           configura o Express
src/
  config/        conexão com o banco
  routes/        URLs e seus controllers
  controllers/   recebem a requisição e respondem
  services/      regras de negócio
  repositories/  consultas SQL
  middlewares/   autenticação, permissões, tratamento de erros
  helpers/       funções auxiliares
```

O fluxo de uma requisição é: rota, controller, service, repository, banco.

## Endpoints

Base: `http://localhost:3000/api`

| Método | Rota | Descrição | Situação |
|---|---|---|---|
| GET | /eventos | lista eventos | pronto |
| GET | /eventos/:id | busca um evento | pronto |
| POST | /eventos | cria evento | pronto |
| POST | /auth/register | cadastro | em andamento |
| POST | /auth/login | login | em andamento |
| GET | /auth/me | dados do usuário logado | em andamento |

Rotas protegidas usam o cabeçalho `Authorization: Bearer <token>`.


## Desenvolvedores da API

Luiz Otávio de Lima Silva
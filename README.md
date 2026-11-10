# SisEve — Back-end

Backend do SisEve, um sistema de gerenciamento de eventos acadêmicos do IFCE Campus Cedro.

A aplicação disponibiliza uma API REST para gerenciamento de usuários, eventos, atividades, inscrições, controle de presença e emissão de certificados.

## Tecnologias

- **Node.js** — ambiente de execução.
- **Express 5** — construção da API REST.
- **PostgreSQL** — banco de dados relacional.
- **Neon** — hospedagem do banco de dados.
- **pg** — comunicação com o PostgreSQL.
- **JWT (jsonwebtoken)** — autenticação por tokens.
- **bcrypt** — hash e verificação de senhas.
- **Zod** — validação de dados.
- **Helmet** — configuração de cabeçalhos HTTP.
- **CORS** — controle de acesso entre origens.
- **dotenv** — gerenciamento de variáveis de ambiente.
- **Nodemon** — reinicialização automática durante o desenvolvimento.

## Estrutura do projeto

```text
SisEve-Back/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── constants/
│   │   └── roles.js
│   ├── controllers/
│   ├── helpers/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   └── profiles.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   └── validate.middleware.js
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── tests/
│   └── validators/
├── app.js
├── server.js
├── package.json
└── README.md
```

### Organização

O projeto utiliza uma organização em camadas para separar as responsabilidades:

| Diretório | Responsabilidade |
|---|---|
| `config` | Configurações e conexão com o banco de dados. |
| `constants` | Constantes compartilhadas, como os perfis de acesso. |
| `controllers` | Recebimento das requisições e envio das respostas. |
| `helpers` | Funções auxiliares e tratamento de erros. |
| `middlewares` | Autenticação, autorização, validação e tratamento de erros. |
| `repositories` | Consultas e operações no banco de dados. |
| `routes` | Definição dos endpoints da API. |
| `schemas` | Schemas de validação com Zod. |
| `services` | Regras de negócio da aplicação. |
| `tests` | Testes de validação e integridade. |
| `validators` | Schemas auxiliares de validação. |

O fluxo de uma requisição segue a estrutura:

```text
Route → Middleware → Controller → Service → Repository → PostgreSQL
```

## Requisitos

- Node.js 18 ou superior.
- npm.
- PostgreSQL ou uma instância hospedada no Neon.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Luilu-star/SisEve-Back.git
```

Entre na pasta:

```bash
cd SisEve-Back
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

DATABASE_URL=sua_string_de_conexao_postgresql

JWT_SECRET=seu_segredo_jwt
JWT_EXPIRES_IN=2h

ADMIN_CODE=codigo_de_cadastro_admin

CORS_ORIGIN=http://localhost:8081
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta utilizada pelo servidor. |
| `DATABASE_URL` | String de conexão com o PostgreSQL. |
| `JWT_SECRET` | Chave utilizada para assinar os tokens JWT. |
| `JWT_EXPIRES_IN` | Tempo de validade dos tokens. |
| `ADMIN_CODE` | Código exigido no cadastro de administradores. |
| `CORS_ORIGIN` | Origens autorizadas a acessar a API. |

Não compartilhe o arquivo `.env` nem envie credenciais para o repositório.

## Banco de dados

O SisEve utiliza PostgreSQL para armazenar os dados da aplicação.

A conexão é configurada em:

```text
src/config/db.js
```

O projeto utiliza a biblioteca `pg` para executar consultas parametrizadas.

A estrutura do banco deve ser criada previamente. As tabelas utilizadas pela aplicação incluem:

- `Usuarios`
- `tipo_usuario`
- `Evento`
- `gerencia_evento`
- `Atividades`
- `Inscricao`
- `atividade_presenca`
- `Certificado`

Os nomes e identificadores das tabelas respeitam a estrutura utilizada nas consultas SQL do projeto.

## Executando a aplicação

Inicie o servidor:

```bash
npm start
```

Durante o desenvolvimento, utilize:

```bash
npm run dev
```

A API utiliza a porta `3000` por padrão.

URL base:

```text
http://localhost:3000/api
```

## Autenticação e autorização

A autenticação utiliza JSON Web Tokens (JWT).

Após realizar o login, a API retorna um token que deve ser enviado nas requisições protegidas utilizando o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

### Perfis de acesso

O projeto centraliza os perfis de autorização em `src/constants/roles.js`.

| Perfil | Identificador |
|---|---|
| Administrador | `admin` |
| Organizador | `organizador` |
| Aluno | `aluno` |

O controle de acesso é realizado por middlewares, permitindo restringir operações de acordo com o perfil do usuário autenticado.

## Endpoints

Todas as rotas utilizam o prefixo `/api`.

### Autenticação e usuários

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/register` | Registra um usuário. |
| POST | `/auth/login` | Realiza a autenticação. |
| GET | `/auth/me` | Retorna os dados do usuário autenticado. |

### Eventos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/eventos` | Lista eventos. |
| GET | `/eventos/:id` | Consulta um evento. |
| POST | `/eventos` | Cadastra um evento. |
| PUT | `/eventos/:id` | Atualiza um evento. |
| DELETE | `/eventos/:id` | Exclui um evento. |

A listagem permite utilizar filtros por nome, categoria e data.

### Outros módulos

O código também possui implementações de serviços, repositories, controllers e arquivos de rotas relacionados a:

- **Atividades:** criação e consulta de atividades vinculadas a eventos.
- **Inscrições:** inscrição de participantes, cancelamento, consulta e gerenciamento da fila de espera.
- **Presenças:** registro e consulta de frequência dos participantes.
- **Certificados:** emissão, validação e consulta de certificados.

A disponibilização desses módulos depende de sua integração ao roteador principal da aplicação.

## Regras de negócio

O sistema contempla regras relacionadas ao funcionamento dos eventos e à participação dos usuários.

Entre elas:

- Inscrições são confirmadas enquanto houver vagas disponíveis.
- Quando a capacidade é atingida, novos participantes são direcionados à lista de espera.
- O cancelamento de uma inscrição confirmada permite promover o primeiro participante da fila.
- O registro de presença exige uma inscrição confirmada.
- A emissão de certificados exige presença confirmada na atividade correspondente.
- Um participante não pode cancelar a inscrição de outro usuário sem possuir a permissão adequada.

## Validação e tratamento de erros

O projeto utiliza Zod para validar os dados recebidos pela API.

Os schemas ficam organizados em `src/schemas`, enquanto o middleware `validate.middleware.js` integra as validações ao fluxo das requisições.

O tratamento de erros utiliza:

- `AppError.js` para erros controlados da aplicação.
- `asyncHandler.js` para encaminhamento de erros assíncronos.
- `errorHandler.js` para tratamento centralizado das exceções.

## Testes

O projeto possui um script de testes para verificar aspectos de integridade e validação.

Para executá-lo:

```bash
node src/tests/testeUsuarios.js
```

Os testes existentes verificam:
- Constantes de perfis.
- Validação de login.
- Validação de cadastro.
- Exigência do código de administrador.
- Validação de dados de eventos.

## Segurança

A aplicação utiliza alguns mecanismos de proteção:

- Consultas parametrizadas ao PostgreSQL.
- Hash de senhas com bcrypt.
- Autenticação baseada em JWT.
- Controle de acesso por perfil.
- Validação de entradas com Zod.
- Helmet para cabeçalhos HTTP.
- Configuração de CORS.
- Limite de tamanho para requisições JSON.

A configuração de segurança deve ser mantida atualizada conforme a evolução da aplicação.

## Autor

**Luiz Otávio de Lima Silva**

[GitHub — SisEve-Back](https://github.com/Luilu-star/SisEve-Back)
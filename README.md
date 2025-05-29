Documentação do Projeto Backend (GTONLINE2 - Atualizada)
Data da Documentação: 29 de Maio de 2025 Estado do Projeto:
Configuração inicial e esquema completo do banco de dados (Seção 01 do escopo) implementados.
Endpoints da API para CRUD de Usuários (Seção 02 do escopo) implementados e testados.
1. Visão Geral do Projeto
Este documento descreve o backend em desenvolvimento, que servirá como base para uma aplicação (possivelmente e-commerce). O projeto utiliza Node.js com o framework Express.js e Sequelize como ORM para interagir com um banco de dados MySQL.
1.1. Autoria e Progresso do Projeto
O desenvolvimento do projeto até o estado atual, realizado por Dani Olivera (GitHub: @daniolivem), compreende:
A configuração inicial completa do projeto e do ambiente de desenvolvimento.
A totalidade da Seção 01 do Escopo do Projeto: Implementar o banco de dados da aplicação (incluindo a criação de todas as tabelas: Users, Categories, Products, ProductImages, ProductOptions, ProductCategories, seus respectivos modelos Sequelize e relacionamentos).
A totalidade da Seção 02 do Escopo do Projeto: Implementar endpoints para o CRUD de usuarios (endpoints POST /v1/user, GET /v1/user/:id, PUT /v1/user/:id, DELETE /v1/user/:id).
1.2. Tecnologias Principais
Node.js: Ambiente de execução JavaScript no servidor.
Express.js: Framework para criação de rotas e APIs.
Dotenv: Gerenciamento de variáveis de ambiente.
Nodemon: Monitoramento de alterações para reiniciar o servidor em desenvolvimento.
MySQL: Sistema de gerenciamento de banco de dados relacional.
Sequelize: ORM para Node.js.
bcryptjs: Biblioteca para hashing de senhas.
jsonwebtoken (JWT): Para implementação de autenticação baseada em token.
Jest: Framework de testes.
Sequelize-CLI: Ferramenta de linha de comando para Sequelize.

2. Configuração do Ambiente de Desenvolvimento
2.1. Pré-requisitos
Node.js (versão LTS recomendada)
npm (instalado com o Node.js)
Servidor MySQL instalado e em execução.
2.2. Passos para Instalação e Configuração
Clonar o Repositório (se aplicável).
Instalar Dependências: npm install
Configurar Variáveis de Ambiente (.env):
 Fragmento do código
APP_PORT=3001 # ou a porta de sua preferência


DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASS=sua_senha_mysql
DB_NAME=seu_banco_de_dados_do_projeto # Certifique-se que este banco exista no MySQL
DB_DIALECT=mysql


JWT_SECRET=seu_segredo_super_secreto_aqui
JWT_EXPIRES_IN=1d


Executar Migrações do Banco de Dados: npx sequelize-cli db:migrate
Rodar o Projeto (Desenvolvimento): npm run dev

3. Estrutura de Diretórios Principal
project-root/
├── migrations/       # Arquivos de migração do Sequelize
├── seeders/          # (Opcional) Arquivos de seed do Sequelize
├── src/
│   ├── config/       # Configurações (ex: database.js)
│   ├── controllers/  # Lógica de requisição/resposta da API
│   ├── middleware/   # Middlewares customizados
│   ├── models/       # Definições dos modelos Sequelize
│   ├── routes/       # Definições das rotas da API
│   ├── services/     # Lógica de negócio
│   ├── app.js        # Configuração principal do Express
│   └── server.js     # Ponto de entrada, inicia o servidor HTTP
├── tests/            # Arquivos de teste (Jest)
├── .env              # Variáveis de ambiente
├── .gitignore        # Arquivos ignorados pelo Git
├── .sequelizerc      # Configuração do Sequelize-CLI
└── package.json      # Metadados e dependências


4. Esquema do Banco de Dados (MySQL com Sequelize)
O banco de dados foi implementado conforme a Seção 01 do escopo, incluindo as tabelas: Users, Categories, Products, ProductImages, ProductOptions, e ProductCategories. As definições detalhadas das colunas e relacionamentos estão nos respectivos arquivos de migração e modelos.

5. Modelos Sequelize (src/models/)
Modelos foram criados para cada tabela, incluindo atributos, validações, hooks (ex: hashing de senha para User) e associações (One-to-Many, Many-to-Many).

6. Endpoints da API Implementados (Corresponde à Seção 02 do Escopo - CRUD de Usuários)
A seguir, os endpoints implementados para o gerenciamento de usuários. Todas as rotas estão prefixadas com /v1/user.
6.1. Criar Novo Usuário
Endpoint: POST /v1/user
Descrição: Cadastra um novo usuário no sistema.
Corpo da Requisição (Payload): { "firstname": "...", "surname": "...", "email": "...", "password": "...", "confirmPassword": "..." }
Resposta de Sucesso: Status 201 Created, Corpo JSON com dados do usuário (sem senha).
Erros Comuns: 400 Bad Request (campos faltando, senhas não coincidem, email já existe, etc.).
6.2. Obter Informações do Usuário pelo ID
Endpoint: GET /v1/user/:id
Descrição: Retorna os dados de um usuário específico.
Resposta de Sucesso: Status 200 OK, Corpo JSON com dados do usuário (sem senha).
Erros Comuns: 400 Bad Request (ID inválido), 404 Not Found.
6.3. Atualizar Usuário
Endpoint: PUT /v1/user/:id
Descrição: Atualiza os dados de um usuário existente (não atualiza senha por este endpoint).
Corpo da Requisição (Payload): { "firstname": "...", "surname": "...", "email": "..." }
Resposta de Sucesso: Status 204 No Content.
Erros Comuns: 400 Bad Request (ID inválido, nenhum dado, falha de validação), 404 Not Found.
6.4. Deletar Usuário
Endpoint: DELETE /v1/user/:id
Descrição: Remove um usuário do sistema.
Resposta de Sucesso: Status 204 No Content.
Erros Comuns: 400 Bad Request (ID inválido), 404 Not Found.

7. Próximos Passos (Para Concluir o Projeto)
Com o CRUD de Usuários concluído, as próximas seções principais do projeto, conforme o escopo original, são:
7.1. Seção 03 - Implementar endpoints para o CRUD de Categorias
Requisito 01: GET /v1/category/search (Obter lista de categorias)
Query Params:
limit (Padrão: 12, -1 para todos)
page (Padrão: 1, ignorado se limit=-1)
fields (ex: name,slug - para limitar campos retornados)
use_in_menu (ex: true - para filtrar por categorias no menu)
Resposta de Sucesso (200 OK): JSON com data, total, limit, page.
Requisito 02: GET /v1/category/:id (Obter informações da categoria pelo ID)
Resposta de Sucesso (200 OK): JSON com dados da categoria.
Erro: 404 Not Found.
Requisito 03: POST /v1/category (Cadastro de categoria)
Payload: { "name": "...", "slug": "...", "use_in_menu": true/false }
Resposta de Sucesso (201 Created): JSON com dados da categoria criada.
Erros: 400 Bad Request, 401 Unauthorized (futuro).
Requisito 04: PUT /v1/category/:id (Atualização de categoria)
Payload: { "name": "...", "slug": "...", "use_in_menu": true/false }
Resposta de Sucesso (204 No Content).
Erros: 400 Bad Request, 401 Unauthorized (futuro), 404 Not Found.
Requisito 05: DELETE /v1/category/:id (Deletar categoria)
Resposta de Sucesso (204 No Content).
Erros: 401 Unauthorized (futuro), 404 Not Found.
7.2. Seção 04 - Implementar endpoints para o CRUD de Produtos
Requisito 01: GET /v1/product/search (Obter lista de produtos)
Query Params:
limit (Padrão: 12, -1 para todos)
page (Padrão: 1)
fields (ex: name,images,price)
match (termo para buscar em nome ou descrição)
category_ids (ex: 15,24)
price-range (ex: 100-200)
option[id_da_opcao] (ex: option[45]=GG,PP)
Resposta de Sucesso (200 OK): JSON com data (incluindo images e options aninhados), total, limit, page.
Requisito 02: GET /v1/product/:id (Obter informações do produto pelo ID)
Resposta de Sucesso (200 OK): JSON com dados detalhados do produto, incluindo images e options.
Erro: 404 Not Found.
Requisito 03: POST /v1/product (Criação de produto)
Payload Complexo: Inclui enabled, name, slug, stock, description, price, price_with_discount, category_ids (array), images (array de objetos com type e content base64), options (array de objetos com title, shape, radius, type, value (array)).
Resposta de Sucesso (201 Created): JSON com dados do produto criado.
Erros: 400 Bad Request, 401 Unauthorized (futuro).
Requisito 04: PUT /v1/product/:id (Atualização de produto)
Payload Complexo: Similar ao POST, permitindo atualização de campos, adição/remoção/atualização de images (com id, deleted, content), e options (com id, deleted, ou novos objetos de opção).
Resposta de Sucesso (204 No Content).
Erros: 400 Bad Request, 401 Unauthorized (futuro), 404 Not Found.
Requisito 05: DELETE /v1/product/:id (Deletar produto)
Resposta de Sucesso (204 No Content).
Erros: 401 Unauthorized (futuro), 404 Not Found.
7.3. Seção 05 - Implementar e validar token JWT
Requisito 01: POST /v1/user/token (Geração do token JWT)
Payload: { "email": "...", "password": "..." }
Resposta de Sucesso (200 OK): { "token": "<JWT>" }
Erro: 400 Bad Request.
Requisito 02: Validar token JWT nos métodos POST, PUT, e DELETE das rotas que exigem autenticação (Categorias, Produtos, e partes do CRUD de Usuário como Atualizar e Deletar).
Se o token não for enviado ou for inválido, retornar 401 Unauthorized.


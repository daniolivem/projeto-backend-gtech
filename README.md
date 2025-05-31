
# Documentação do Projeto Backend (GTONLINE2)

**Data da Documentação:** 29 de Maio de 2025

**Estado do Projeto:**
* Configuração inicial e esquema completo do banco de dados (Seção 01 do escopo) implementados.
* Endpoints da API para CRUD de Usuários (Seção 02 do escopo) implementados e testados.

## 1. Visão Geral do Projeto

Este documento descreve o backend em desenvolvimento, que servirá como base para uma aplicação (possivelmente e-commerce). O projeto utiliza Node.js com o framework Express.js e Sequelize como ORM para interagir com um banco de dados MySQL.

### 1.1. Autoria e Progresso do Projeto
* O desenvolvimento do projeto realizado por **Daniely Olivera - [@daniolivem](https://github.com/daniolivem)**, compreende:
    * A configuração inicial completa do projeto e do ambiente de desenvolvimento.
    * A totalidade da **Seção 01: Implementar o banco de dados da aplicação** (incluindo a criação de todas as tabelas: `Users`, `Categories`, `Products`, `ProductImages`, `ProductOptions`, `ProductCategories`, seus respectivos modelos Sequelize e relacionamentos).
    * A totalidade da **Seção 02: Implementar endpoints para o CRUD de usuarios** (endpoints `POST /v1/user`, `GET /v1/user/:id`, `PUT /v1/user/:id`, `DELETE /v1/user/:id`).
 
* O desenvolvimento do projeto realizado por **Ademar Lima** - [@ademar506](https://github.com/ademar506), compreende:
* Seção 04 - Implementar endpoints para o CRUD de Produtos;
    
* Seção 05 - Implementar e validar token JWT - estado atual, realizado por **Anderson Pontes - [@andersonpontes88](https://github.com/andersonpontes88)**:
    * Criação do Middleware de Autenticação (middleware/authMiddleware.js).
    * Criação do endpoint de login (POST /v1/token)
    * Implementação para gerar o token JWT ao fazer login, incluindo validação do token JWT em rotas protegidas.
    * Expiração do token JWT após 1 dia.
    * Autenticação para rotas PUT e DELETE, em deletar ou atualizar usuários.
    * Criado o loginUser no controller para autenticar e gerar o token JWT com base nos dados fornecidos pelo usuário.
    

### 1.2. Tecnologias Principais

* **Node.js**: Ambiente de execução JavaScript no servidor.
* **Express.js**: Framework para criação de rotas e APIs.
* **Dotenv**: Gerenciamento de variáveis de ambiente.
* **Nodemon**: Monitoramento de alterações para reiniciar o servidor em desenvolvimento.
* **MySQL**: Sistema de gerenciamento de banco de dados relacional.
* **Sequelize**: ORM para Node.js.
* **bcryptjs**: Biblioteca para hashing de senhas.
* **jsonwebtoken (JWT)**: Para implementação de autenticação baseada em token.
* **Jest**: Framework de testes.
* **Sequelize-CLI**: Ferramenta de linha de comando para Sequelize.

---
## 2. Configuração do Ambiente de Desenvolvimento

### 2.1. Pré-requisitos

* Node.js (versão LTS recomendada)
* npm (instalado com o Node.js)
* Servidor MySQL instalado e em execução.

### 2.2. Passos para Instalação e Configuração

1.  **Clonar o Repositório** (se aplicável).
2.  **Instalar Dependências:**
    ```bash
    npm install
    ```
3.  **Configurar Variáveis de Ambiente (`.env`):**
    Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo, ajustando os valores conforme necessário:
    ```env
    APP_PORT=3001

    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASS=sua_senha_mysql
    DB_NAME=seu_banco_de_dados_do_projeto
    DB_DIALECT=mysql

    JWT_SECRET=seu_segredo_super_secreto_aqui
    JWT_EXPIRES_IN=1d
    ```
    *Certifique-se de que o banco de dados (`DB_NAME`) exista no seu MySQL.*
4.  **Executar Migrações do Banco de Dados:**
    ```bash
    npx sequelize-cli db:migrate
    ```
5.  **Rodar o Projeto (Desenvolvimento):**
    ```bash
    npm run dev
    ```
    O servidor será iniciado (padrão na porta definida em `APP_PORT` ou 3001).

---
## 3. Estrutura de Diretórios Principal

```
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
├── .env              # Variáveis de ambiente (NÃO versionar)
├── .gitignore        # Arquivos ignorados pelo Git
├── .sequelizerc      # Configuração do Sequelize-CLI
└── package.json      # Metadados e dependências
```

---
## 4. Esquema do Banco de Dados (MySQL com Sequelize)

O banco de dados foi implementado conforme a Seção 01 do escopo do projeto, utilizando Sequelize. As tabelas criadas incluem:
* `Users`
* `Categories`
* `Products`
* `ProductImages`
* `ProductOptions`
* `ProductCategories` (tabela de junção para o relacionamento N:M entre Produtos e Categorias)

As definições detalhadas das colunas, tipos, restrições (PK, FK, allowNull, unique, defaultValue) e relacionamentos estão nos respectivos arquivos de migração na pasta `migrations/` e nos modelos Sequelize.

---
## 5. Modelos Sequelize (`src/models/`)

Para cada tabela do banco de dados, um modelo Sequelize correspondente foi criado e configurado em `src/models/`. Estes modelos incluem:

* Definição dos atributos e seus tipos de dados.
* Validações a nível de aplicação para garantir a integridade dos dados.
* Valores padrão para campos específicos.
* **Hooks (Gatilhos):**
    * O modelo `User.js` possui hooks `beforeCreate` e `beforeUpdate` para automaticamente criptografar (hash) a senha do usuário usando `bcryptjs` antes de salvar no banco.
    * O modelo `User.js` também inclui um método de instância `validPassword(password)` para facilitar a verificação de senhas durante o login.
* **Associações entre modelos:**
    * `Product` ↔ `ProductImage` (One-to-Many)
    * `Product` ↔ `ProductOption` (One-to-Many)
    * `Product` ↔ `Category` (Many-to-Many, através do modelo `ProductCategory`)

---
## 6. Endpoints da API Implementados (Seção 02 do Escopo - CRUD de Usuários)

Os seguintes endpoints para o gerenciamento de usuários foram implementados e testados. Todas as rotas de usuário estão prefixadas com `/v1/user`.

### 6.1. Criar Novo Usuário
* **Endpoint:** `POST /v1/user`
* **Descrição:** Cadastra um novo usuário no sistema.
* **Corpo da Requisição (Payload):**
  ```json
  {
    "firstname": "Nome",
    "surname": "Sobrenome",
    "email": "usuario@example.com",
    "password": "senhaSegura123",
    "confirmPassword": "senhaSegura123"
  }
  ```
* **Resposta de Sucesso:**
    * **Status:** `201 Created`
    * **Corpo:** JSON com os dados do usuário criado (excluindo a senha).
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Campos faltando, senhas não coincidem, email já existe, ou outras falhas de validação.

### 6.2. Obter Informações do Usuário pelo ID
* **Endpoint:** `GET /v1/user/:id`
* **Descrição:** Retorna os dados de um usuário específico.
* **Resposta de Sucesso:**
    * **Status:** `200 OK`
    * **Corpo:** JSON com os dados do usuário (excluindo a senha).
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: Se o ID fornecido for inválido.
    * `404 Not Found`: Se o usuário com o ID especificado não for encontrado.

### 6.3. Atualizar Usuário
* **Endpoint:** `PUT /v1/user/:id`
* **Descrição:** Atualiza os dados de um usuário existente (não atualiza a senha por este endpoint).
* **Corpo da Requisição (Payload):**
  ```json
  {
    "firstname": "Novo Nome",
    "surname": "Novo Sobrenome",
    "email": "novo.email@example.com"
  }
  ```
* **Resposta de Sucesso:**
    * **Status:** `204 No Content`
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: ID inválido, nenhum dado fornecido para atualização, ou falha de validação.
    * `404 Not Found`: Usuário não encontrado.

### 6.4. Deletar Usuário
* **Endpoint:** `DELETE /v1/user/:id`
* **Descrição:** Remove um usuário do sistema.
* **Resposta de Sucesso:**
    * **Status:** `204 No Content`
* **Respostas de Erro Comuns:**
    * `400 Bad Request`: ID inválido.
    * `404 Not Found`: Usuário não encontrado.

*(Nota: A autenticação JWT e o status `401 Unauthorized` para endpoints protegidos serão implementados em uma seção futura).*

---
## 7. Próximos Passos (Para Concluir o Projeto)

Com o CRUD de Usuários concluído, as próximas seções principais do projeto, conforme o escopo original, são:

### 7.1. Seção 03 - Implementar endpoints para o CRUD de Categorias
* **Requisito 01: `GET /v1/category/search`** (Obter lista de categorias)
    * **Query Params:** `limit`, `page`, `fields`, `use_in_menu`.
    * **Resposta (200 OK):** JSON com `data`, `total`, `limit`, `page`.
* **Requisito 02: `GET /v1/category/:id`** (Obter categoria pelo ID)
    * **Resposta (200 OK):** JSON com dados da categoria.
    * **Erro:** `404 Not Found`.
* **Requisito 03: `POST /v1/category`** (Cadastro de categoria)
    * **Payload:** `{ "name": "...", "slug": "...", "use_in_menu": true/false }`
    * **Resposta (201 Created):** JSON com dados da categoria criada.
    * **Erros:** `400 Bad Request`.
* **Requisito 04: `PUT /v1/category/:id`** (Atualização de categoria)
    * **Payload:** `{ "name": "...", "slug": "...", "use_in_menu": true/false }`
    * **Resposta (204 No Content)**.
    * **Erros:** `400 Bad Request`, `404 Not Found`.
* **Requisito 05: `DELETE /v1/category/:id`** (Deletar categoria)
    * **Resposta (204 No Content)**.
    * **Erros:** `404 Not Found`.

### 7.2. Seção 04 - Implementar endpoints para o CRUD de Produtos
* **Requisito 01: `GET /v1/product/search`** (Obter lista de produtos)
    * **Query Params:** `limit`, `page`, `fields`, `match`, `category_ids`, `price-range`, `option[id_da_opcao]`.
    * **Resposta (200 OK):** JSON com `data` (incluindo `images` e `options`), `total`, `limit`, `page`.
* **Requisito 02: `GET /v1/product/:id`** (Obter produto pelo ID)
    * **Resposta (200 OK):** JSON com dados detalhados do produto.
    * **Erro:** `404 Not Found`.
* **Requisito 03: `POST /v1/product`** (Criação de produto)
    * **Payload Complexo:** Incluindo dados básicos, `category_ids`, `images` (base64), `options`.
    * **Resposta (201 Created):** JSON com dados do produto criado.
    * **Erros:** `400 Bad Request`.
* **Requisito 04: `PUT /v1/product/:id`** (Atualização de produto)
    * **Payload Complexo:** Similar ao POST, com tratamento para atualização/deleção de `images` e `options`.
    * **Resposta (204 No Content)**.
    * **Erros:** `400 Bad Request`, `404 Not Found`.
* **Requisito 05: `DELETE /v1/product/:id`** (Deletar produto)
    * **Resposta (204 No Content)**.
    * **Erros:** `404 Not Found`.

### 7.3. Seção 05 - Implementar e validar token JWT
* **Requisito 01: `POST /v1/user/token`** (Geração do token JWT)
    * **Payload:** `{ "email": "...", "password": "..." }`
    * **Resposta (200 OK):** `{ "token": "<JWT>" }`
    * **Erro:** `400 Bad Request`.
* **Requisito 02: Validar token JWT** nos métodos `POST`, `PUT`, e `DELETE` das rotas de Categorias e Produtos, e nas rotas de Atualizar e Deletar Usuário. Resposta `401 Unauthorized` para token ausente/inválido.


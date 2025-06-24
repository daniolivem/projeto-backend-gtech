# Projeto Backend (GTONLINE2)

**Data da Documentação:** 23 de junho de 2025

**Estado do Projeto:**
* Projeto concluído: todas as funcionalidades previstas no escopo do reposítório da Digital College foram implementadas e testadas.

## 1. Visão Geral do Projeto

Este documento descreve o backend finalizado, que serve como base para uma aplicação de e-commerce. O projeto utiliza Node.js com o framework Express.js e Sequelize como ORM para interagir com um banco de dados MySQL.

---

## 📄 Documentação Interativa (Postman)

Acesse a documentação interativa e exemplos de uso dos endpoints diretamente no Postman:

[https://documenter.getpostman.com/view/45341254/2sB2xCh9ee](https://documenter.getpostman.com/view/45341254/2sB2xCh9ee)

---

## 👥 Integrantes e Contribuições

| Nome                | GitHub                                                                                                 | Principais Contribuições                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Daniely Olivera** | [![GitHub](https://img.shields.io/badge/GitHub-daniolivem-181717?style=flat&logo=github)](https://github.com/daniolivem) | Configuração inicial, Banco de Dados, CRUD de Usuários e Categorias    |
| **Ademar Lima**     | [![GitHub](https://img.shields.io/badge/GitHub-ademar506-181717?style=flat&logo=github)](https://github.com/ademar506)   | CRUD de Produtos                                                      |
| **Anderson Pontes** | [![GitHub](https://img.shields.io/badge/GitHub-andersonpontes88-181717?style=flat&logo=github)](https://github.com/andersonpontes88) | Middleware de Autenticação e implementação do Token JWT                |

> Para ver as estatísticas detalhadas de commits, acesse: **[Contributors Graph](https://github.com/daniolivem/projeto-backend-gtech/graphs/contributors)**

### Detalhamento das Contribuições

* **Daniely Olivera**
  * Configuração inicial do projeto e ambiente de desenvolvimento.
  * Implementação do banco de dados e modelos Sequelize (`Users`, `Categories`, `Products`, `ProductImages`, `ProductOptions`, `ProductCategories`).
  * CRUD de usuários (`POST /v1/user`, `GET /v1/user/:id`, `PUT /v1/user/:id`, `DELETE /v1/user/:id`).
  * CRUD de categorias (`POST /v1/category`, `GET /v1/category/:id`, `PUT /v1/category/:id`, `DELETE /v1/category/:id`, `GET /v1/category/search`).

* **Ademar Lima**
  * CRUD de Produtos.

* **Anderson Pontes** 
  * Criação do Middleware de Autenticação (`middleware/authMiddleware.js`).
  * Criação do endpoint de login (`POST /v1/user/token`).
  * Implementação para gerar o token JWT ao fazer login, incluindo validação do token JWT em rotas protegidas.
  * Expiração do token JWT após 1 dia.
  * Aplicação da autenticação para rotas `PUT` e `DELETE` de Usuários e `POST`, `PUT`, `DELETE` de Categorias.

---

## 🛠️ Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-00758F?logo=mysql&logoColor=white&style=flat-square)
![Sequelize](https://img.shields.io/badge/Sequelize-52b0e7?logo=sequelize&logoColor=white&style=flat-square)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=flat-square)
![bcryptjs](https://img.shields.io/badge/bcryptjs-004289?style=flat-square)
![Dotenv](https://img.shields.io/badge/dotenv-8DD6F9?logo=dotenv&logoColor=black&style=flat-square)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=white&style=flat-square)

---

## 2. Configuração do Ambiente de Desenvolvimento

### 2.1. Pré-requisitos

* Node.js (versão LTS recomendada)
* npm (instalado com o Node.js)
* Servidor MySQL instalado e em execução.

* Certifique-se de instalar o pacote cors antes de rodar o projeto:

```bash
npm install cors
```

### 2.2. Passos para Instalação e Configuração

1. **Clonar o Repositório** (se aplicável).
2. **Instalar Dependências:**
    ```bash
    npm install
    ```
3. **Configurar Variáveis de Ambiente (`.env`):**
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
4. **Executar Migrações do Banco de Dados:**
    ```bash
    npx sequelize-cli db:migrate
    ```
5. **Rodar o Projeto (Desenvolvimento):**
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

O banco de dados foi implementado conforme o escopo do projeto, utilizando Sequelize. As tabelas criadas incluem:
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

## 6. Endpoints da API Implementados

Todos os endpoints previstos no escopo foram implementados e testados, incluindo autenticação, CRUD de usuários, categorias e produtos. Para exemplos detalhados de uso, consulte a documentação interativa do Postman.

---

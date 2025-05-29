

# GTONLINE2 - Backend

**Documentação atualizada em 29 de Maio de 2025**

## Estado do Projeto

- ✅ Configuração inicial e esquema completo do banco de dados implementados (Seção 01 do escopo)
- ✅ CRUD de Usuários implementado e testado (Seção 02 do escopo)

---

## 1. Visão Geral

Backend para aplicação (ex: e-commerce), desenvolvido em Node.js com Express.js e Sequelize.

---

## 2. Autoria

- **Autor:** Dani Olivera ([GitHub: @daniolivem](https://github.com/daniolivem))

---

## 3. Tecnologias Utilizadas

- Node.js
- Express.js
- Dotenv
- Nodemon
- MySQL
- Sequelize & Sequelize-CLI
- bcryptjs
- jsonwebtoken (JWT)
- Jest

---

## 4. Configuração do Ambiente

### 4.1. Pré-requisitos

- Node.js (LTS)
- npm
- MySQL

### 4.2. Instalação

```bash
# Clone o repositório
git clone https://github.com/daniolivem/projeto-backend-gtech.git
cd projeto-backend-gtech

# Instale as dependências
npm install
```

### 4.3. Configuração

Crie um arquivo `.env` na raiz do projeto com:

```env
APP_PORT=3001
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASS=sua_senha_mysql
DB_NAME=seu_banco_de_dados
DB_DIALECT=mysql
JWT_SECRET=seu_segredo
JWT_EXPIRES_IN=1d
```

### 4.4. Banco de Dados

```bash
# Execute as migrações para criar as tabelas
npx sequelize-cli db:migrate
```

### 4.5. Execução

```bash
# Inicie o servidor em modo desenvolvimento
npm run dev
```

---

## 5. Estrutura de Diretórios

```
project-root/
├── migrations/       # Migrações do Sequelize
├── seeders/          # Seeds do Sequelize (opcional)
├── src/
│   ├── config/       # Configurações (ex: database.js)
│   ├── controllers/  # Lógica das rotas
│   ├── middleware/   # Middlewares customizados
│   ├── models/       # Modelos Sequelize
│   ├── routes/       # Rotas da API
│   ├── services/     # Lógica de negócio
│   ├── app.js        # Configuração principal do Express
│   └── server.js     # Ponto de entrada da aplicação
├── tests/            # Testes (Jest)
├── .env
├── .gitignore
├── .sequelizerc
└── package.json
```

---

## 6. Esquema do Banco de Dados

- Tabelas: Users, Categories, Products, ProductImages, ProductOptions, ProductCategories
- Relacionamentos One-to-Many e Many-to-Many implementados conforme escopo.

---

## 7. Endpoints de Usuário (CRUD)

Prefixo das rotas: `/v1/user`

| Método   | Rota           | Descrição                        | Resposta           |
|----------|----------------|----------------------------------|--------------------|
| POST     | /v1/user       | Cria novo usuário                | 201 Created        |
| GET      | /v1/user/:id   | Busca usuário por ID             | 200 OK / 404       |
| PUT      | /v1/user/:id   | Atualiza usuário (exceto senha)  | 204 No Content/404 |
| DELETE   | /v1/user/:id   | Remove usuário                   | 204 No Content/404 |

**Exemplo de payload para criação:**

```json
{
  "firstname": "Nome",
  "surname": "Sobrenome",
  "email": "email@dominio.com",
  "password": "senha",
  "confirmPassword": "senha"
}
```

---

## 8. Próximos Passos

### 8.1. CRUD de Categorias (`/v1/category`)
- GET `/v1/category/search`
- GET `/v1/category/:id`
- POST `/v1/category`
- PUT `/v1/category/:id`
- DELETE `/v1/category/:id`

### 8.2. CRUD de Produtos (`/v1/product`)
- GET `/v1/product/search`
- GET `/v1/product/:id`
- POST `/v1/product`
- PUT `/v1/product/:id`
- DELETE `/v1/product/:id`

### 8.3. Autenticação JWT

- POST `/v1/user/token`  
  **Payload:**  
  ```json
  { "email": "...", "password": "..." }
  ```
  **Resposta:**  
  ```json
  { "token": "<JWT>" }
  ```
- Proteger métodos POST, PUT, DELETE das rotas de categorias, produtos e usuários.




# Expense Tracker API Documentation

Bem-vindo à documentação da API de Despesas! Esta API fornece recursos para gestão de usuários, autenticação restrita e controle financeiro pessoal.

## 🔐 Autenticação

As rotas de despesas desta API são protegidas e exigem autenticação via **JSON Web Token (JWT)**.
Para acessá-las, você deve estar cadastrado, realizar o login e enviar o seu Token no cabeçalho HTTP usando o esquema `Bearer`:

**Exemplo de Header:**
`Authorization: Bearer <seu_token_aqui>`

---

## 👤 Endpoints de Usuários (Users)

### 1. Criar Usuário (Signup)
Cria um novo portador no sistema.

- **URL:** `POST /api/users`
- **Autenticação:** Não necessária
- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "password": "senha_segura_123"
  }
  ```

---

## 🔑 Endpoints de Autenticação (Auth)

### 2. Login
Obtém o Token credencial para as rotas protegidas.

- **URL:** `POST /auth/login`
- **Autenticação:** Não necessária
- **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "maria@exemplo.com",
    "password": "senha_segura_123"
  }
  ```
- **Resposta Esperada:** Sucesso retorna o token e as informações básicas em `data`.

---

## 💸 Endpoints de Despesas (Expenses)

> **Aviso:** Todas as rotas abaixo requerem o cabeçalho `Authorization: Bearer <token>`.

### 3. Criar Despesa
Registra um novo gasto vinculado ao usuário do token!

- **URL:** `POST /api/expenses`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "description": "Pizza de Sexta",
    "amount": 50.00,
    "date": "2026-04-02",
    "category": "Leisure"
  }
  ```
- **Regras:** 
  - `amount` deve ser estritamente maior que 0.
  - `category` aceita apenas: `Groceries, Leisure, Electronics, Utilities, Clothing, Health, Others`.

### 4. Listar Despesas
Traz a lista das suas despesas em ordem das mais recentes.

- **URL:** `GET /api/expenses`
- **Filtros (Opcionais - Query Params):**
  - `?filter=past_week` (Últimos 7 dias)
  - `?filter=past_month` (Último mês)
  - `?filter=last_3_months` (Últimos 3 meses)
  - `?start_date=2026-01-01&end_date=2026-12-31` (Período customizado)
- **Exemplo Prático:** `GET /api/expenses?filter=past_month`

### 5. Exibir uma Despesa
Busca os detalhes de uma fatura específica pelo ID.

- **URL:** `GET /api/expenses/:id`

### 6. Atualizar Despesa
Edita as informações de uma despesa.

- **URL:** `PUT /api/expenses/:id`
- **Corpo (JSON):** Envie apenas os campos que deseja sobrescrever (`description`, `amount`, `category`, ou `date`).

### 7. Deletar Despesa
Remove permanentemente a despesa correspondente do banco.

- **URL:** `DELETE /api/expenses/:id`


### 1. **Query Mínima (Só Email)**
```graphql
query getUserByIdMinimal($userId: ID!) {
  user(id: $userId) {
    email
  }
}
```

**Variáveis:**
```json
{
  "userId": "1"
}
```

**SQL esperado:**
```sql
SELECT id, email FROM users WHERE id = 1;
```

---

### 2. **Query Completa (Todos os Dados)**
```graphql
query getUserByIdComplete($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    position
    isActive
    createdAt
    updatedAt
  }
}
```

**Variáveis:**
```json
{
  "userId": "1"
}
```

**SQL esperado:**
```sql
SELECT id, name, email, position, isActive, createdAt, updatedAt FROM users WHERE id = 1;
```

---

### 3. **Query Média (Dados Essenciais)**
```graphql
query getUserByIdEssential($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    position
    isActive
  }
}
```

**Variáveis:**
```json
{
  "userId": "1"
}
```

**SQL esperado:**
```sql
SELECT id, name, email, position, isActive FROM users WHERE id = 1;
```

---

### 4. **Query para Lista de Usuários (Mínima)**
```graphql
query getUsersListMinimal {
  users {
    id
    name
    isActive
  }
}
```

**SQL esperado:**
```sql
SELECT id, name, isActive FROM users ORDER BY createdAt DESC;
```

---

### 5. **Query para Lista de Usuários (Completa)**
```graphql
query getUsersListComplete {
  users {
    id
    name
    email
    position
    isActive
    createdAt
    updatedAt
  }
}
```

**SQL esperado:**
```sql
SELECT id, name, email, position, isActive, createdAt, updatedAt FROM users ORDER BY createdAt DESC;
```

---

## 📋 Como Testar

### Passo 1: Fazer Login
```graphql
mutation {
  login(input: {
    email: "seu_email@example.com"
    password: "sua_senha"
  }) {
    tokens {
      accessToken
    }
  }
}
```

### Passo 2: Usar o Token nos Headers
```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

### Passo 3: Executar as Queries
Execute cada query acima e observe os logs no console do servidor.

## 🔍 O que Observar nos Logs

Procure por estas mensagens no console:
- `🎯 Campos solicitados: ['email']`
- `🗃️ Atributos Sequelize: ['id', 'email']`
- `🗃️ Executando SQL otimizado para campos: ['id', 'email']`

## 📊 Comparação de Performance

| Query | Campos Solicitados | Campos no SQL | Economia |
|-------|-------------------|---------------|----------|
| Mínima | 1 (email) | 2 (id, email) | ~70% |
| Essencial | 5 campos | 5 campos | ~30% |
| Completa | 7 campos | 7 campos | 0% |

## 🎭 Demonstração da Otimização

### Antes (Sem otimização):
```sql
-- Sempre busca todos os campos
SELECT id, name, email, position, isActive, createdAt, updatedAt FROM users WHERE id = 1;
```

### Depois (Com otimização):
```sql
-- Busca apenas o que foi solicitado
SELECT id, email FROM users WHERE id = 1;  -- Para query mínima
SELECT id, name, email, position, isActive FROM users WHERE id = 1;  -- Para query essencial
```

## 🚀 Benefícios Práticos

1. **Menos Tráfego de Rede**: Até 70% de redução
2. **Melhor Performance**: Banco processa menos dados
3. **Economia de Memória**: Menos dados em cache
4. **Experiência Mobile**: Carregamento mais rápido

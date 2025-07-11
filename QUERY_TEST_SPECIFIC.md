# 🎯 Query de Teste Específica

## Query que você deve testar:

```graphql
query getUserById($userId: ID!) {
  user(id: $userId) {
    email
  }
}
```

### Variáveis:
```json
{
  "userId": "1"
}
```

### Headers (necessário):
```json
{
  "Authorization": "Bearer SEU_TOKEN_JWT_AQUI"
}
```

## 🔍 O que vai acontecer:

1. **No Console do Servidor** você verá:
   ```
   🔍 GraphQL Query.user chamado com: { id: '1', hasUser: true }
   📋 Buscando usuário ID: 1
   🎯 Campos solicitados: ['email']
   🗃️ Atributos Sequelize: ['id', 'email']
   🗃️ Executando SQL otimizado para campos: ['id', 'email']
   ✅ Usuário encontrado: { id: 1, email: 'usuario@example.com' }
   ```

2. **SQL Executado** (otimizado):
   ```sql
   SELECT id, email FROM users WHERE id = 1;
   ```

3. **Resposta GraphQL**:
   ```json
   {
     "data": {
       "user": {
         "email": "usuario@example.com"
       }
     }
   }
   ```

## 🆚 Comparação com Query Completa:

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

### Logs para Query Completa:
```
🎯 Campos solicitados: ['id', 'name', 'email', 'position', 'isActive', 'createdAt', 'updatedAt']
🗃️ Atributos Sequelize: ['id', 'name', 'email', 'position', 'isActive', 'createdAt', 'updatedAt']
```

### SQL para Query Completa:
```sql
SELECT id, name, email, position, isActive, createdAt, updatedAt FROM users WHERE id = 1;
```

## 📊 Resultado da Otimização:

- **Query Mínima**: 2 campos no SQL (economia de ~70%)
- **Query Completa**: 7 campos no SQL (sem economia)

**Conclusão**: O GraphQL está otimizando automaticamente as consultas SQL baseado nos campos solicitados!

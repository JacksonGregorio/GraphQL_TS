# 🧪 TESTE PRÁTICO - Query com Critérios Específicos

## 🎯 Query Principal: Usuários com ID par e position > 1

```graphql
query UsersEvenIdPositionGreaterThan1 {
  getUsersWithCriteria(
    evenIds: true
    minPosition: 1
  ) {
    id
    name
    email
    position
    isActive
  }
}
```

## 🔧 Como Testar

### **1. Fazer Login**
```graphql
mutation {
  login(input: {
    email: "admin@example.com"
    password: "123456"
  }) {
    tokens {
      accessToken
    }
  }
}
```

### **2. Configurar Header**
```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

### **3. Executar a Query**
Cole a query acima no GraphQL Studio (`http://localhost:3000/graphql`)

## 📊 Resultado Esperado

```json
{
  "data": {
    "getUsersWithCriteria": [
      {
        "id": "2",
        "name": "Usuario 2",
        "email": "user2@example.com",
        "position": 2,
        "isActive": true
      },
      {
        "id": "4",
        "name": "Usuario 4",
        "email": "user4@example.com",
        "position": 3,
        "isActive": true
      }
    ]
  }
}
```

## 🎭 Outras Queries para Testar

### **Só IDs pares:**
```graphql
query {
  getUsersWithCriteria(evenIds: true, limit: 5) {
    id
    name
  }
}
```

### **Position entre 2 e 4:**
```graphql
query {
  getUsersWithCriteria(minPosition: 2, maxPosition: 4) {
    id
    name
    position
  }
}
```

### **Usuários ativos:**
```graphql
query {
  getUsersWithCriteria(isActive: true, limit: 10) {
    id
    name
    isActive
  }
}
```

## ✅ Aplicado no Código

✅ **Schema atualizado** com nova query `getUsersWithCriteria`
✅ **Resolver implementado** com filtros dinâmicos
✅ **Segurança aplicada** (só admins podem usar)
✅ **Campos sensíveis protegidos** automaticamente

**Pronto para testar!** 🚀

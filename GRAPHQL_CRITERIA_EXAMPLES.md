

### **1. Buscar usuários com ID par e position > 1**
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

### **2. Buscar usuários com critérios múltiplos**
```graphql
query UsersMultipleCriteria {
  getUsersWithCriteria(
    evenIds: true
    minPosition: 1
    maxPosition: 5
    isActive: true
    limit: 10
  ) {
    id
    name
    email
    position
    isActive
    createdAt
  }
}
```

### **3. Buscar apenas usuários ativos com position entre 2 e 4**
```graphql
query UsersActivePositionRange {
  getUsersWithCriteria(
    minPosition: 2
    maxPosition: 4
    isActive: true
    limit: 20
  ) {
    id
    name
    email
    position
    isActive
  }
}
```

### **4. Buscar usuários com ID par (sem outros filtros)**
```graphql
query UsersEvenIdsOnly {
  getUsersWithCriteria(
    evenIds: true
    limit: 15
  ) {
    id
    name
    email
    position
  }
}
```

### **5. Buscar usuários inativos com position alta**
```graphql
query UsersInactiveHighPosition {
  getUsersWithCriteria(
    minPosition: 3
    isActive: false
    limit: 5
  ) {
    id
    name
    email
    position
    isActive
    updatedAt
  }
}
```

## 🎮 Como Testar

### **Passo 1: Fazer Login**
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

### **Passo 2: Configurar Headers**
```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

### **Passo 3: Executar Queries**
Execute qualquer uma das queries acima e observe os resultados!

## 🧪 Cenários de Teste

### **Teste 1: Verificar IDs Pares**
```graphql
query TestEvenIds {
  getUsersWithCriteria(evenIds: true, limit: 10) {
    id
    name
  }
}
```
**Resultado esperado:** Todos os IDs devem ser pares (2, 4, 6, 8, etc.)

### **Teste 2: Verificar Range de Position**
```graphql
query TestPositionRange {
  getUsersWithCriteria(minPosition: 2, maxPosition: 4) {
    id
    name
    position
  }
}
```
**Resultado esperado:** Todas as positions devem estar entre 2 e 4 (exclusive)

### **Teste 3: Combinação Complexa**
```graphql
query TestComplexCriteria {
  getUsersWithCriteria(
    evenIds: true
    minPosition: 1
    isActive: true
    limit: 5
  ) {
    id
    name
    position
    isActive
  }
}
```
**Resultado esperado:** 
- IDs pares
- Position > 1
- isActive = true

## 📊 Parâmetros Disponíveis

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `evenIds` | Boolean | Filtrar apenas IDs pares | `true` |
| `minPosition` | Int | Position maior que o valor | `1` |
| `maxPosition` | Int | Position menor que o valor | `5` |
| `isActive` | Boolean | Filtrar por status ativo | `true` |
| `limit` | Int | Limite de resultados | `10` |
| `offset` | Int | Pular registros | `0` |

## 🔧 Lógica dos Filtros

### **evenIds: true**
- Busca mais registros do banco
- Filtra na aplicação: `user.id % 2 === 0`
- Aplica limit após filtrar

### **minPosition: 2**
- SQL: `WHERE position > 2`

### **maxPosition: 5**
- SQL: `WHERE position < 5`

### **Combinado**
- SQL: `WHERE position > 2 AND position < 5 AND isActive = true`
- Aplicação: Filtra IDs pares se `evenIds = true`

## 🎯 Casos de Uso Reais

1. **Relatórios**: Buscar usuários com critérios específicos
2. **Auditoria**: Encontrar padrões nos dados
3. **Análise**: Filtrar dados para dashboards
4. **Manutenção**: Identificar registros específicos

**Resultado:** Agora você tem uma query GraphQL flexível para buscar usuários com critérios complexos! 🚀

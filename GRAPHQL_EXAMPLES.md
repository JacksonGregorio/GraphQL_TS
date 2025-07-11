

### 1. Login
```graphql
mutation {
  login(email: "admin@example.com", password: "123456") {
    token
    refreshToken
    user {
      id
      name
      email
      position
      isActive
    }
  }
}
```

### 2. Refresh Token
```graphql
mutation {
  refreshToken(refreshToken: "seu_refresh_token_aqui") {
    token
    refreshToken
  }
}
```

## Queries de Usuários

### 3. Obter perfil do usuário logado
```graphql
query {
  profile {
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

### 4. Listar todos os usuários (Admin)
```graphql
query {
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

### 5. Obter usuário específico
```graphql
query {
  user(id: 1) {
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

### 6. Buscar usuários
```graphql
query {
  searchUsers(searchTerm: "admin") {
    id
    name
    email
    position
    isActive
  }
}
```

## Mutations de Usuários

### 7. Criar novo usuário
```graphql
mutation {
  createUser(input: {
    name: "João Silva"
    email: "joao@example.com"
    password: "123456"
    position: 3
  }) {
    id
    name
    email
    position
    isActive
    createdAt
  }
}
```

### 8. Atualizar usuário
```graphql
mutation {
  updateUser(id: 1, input: {
    name: "João Silva Updated"
    email: "joao.updated@example.com"
    position: 2
  }) {
    id
    name
    email
    position
    isActive
    updatedAt
  }
}
```

### 9. Deletar usuário
```graphql
mutation {
  deleteUser(id: 1) {
    id
    name
    email
  }
}
```

### 10. Ativar usuário
```graphql
mutation {
  activateUser(id: 1) {
    id
    name
    email
    isActive
  }
}
```

### 11. Desativar usuário
```graphql
mutation {
  deactivateUser(id: 1) {
    id
    name
    email
    isActive
  }
}
```

### 12. Alterar senha
```graphql
mutation {
  changePassword(oldPassword: "123456", newPassword: "novaSenha123") {
    id
    name
    email
    updatedAt
  }
}
```

## Queries de Permissões

### 13. Verificar permissões do usuário
```graphql
query {
  checkPermission(permission: "can_create_user")
}
```

### 14. Listar permissões do usuário
```graphql
query {
  userPermissions {
    permission
    hasPermission
  }
}
```

## Como usar no Header (para autenticação)

Ao fazer requisições GraphQL que requerem autenticação, adicione o header:

```json
{
  "Authorization": "Bearer SEU_JWT_TOKEN_AQUI"
}
```

## Exemplos de Variáveis

### Para criar usuário:
```json
{
  "input": {
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "senha123",
    "position": 2
  }
}
```

### Para buscar usuário:
```json
{
  "id": 1
}
```

### Para alterar senha:
```json
{
  "oldPassword": "senhaAtual",
  "newPassword": "novaSenha123"
}
```

## Posições (Roles)
- 1: Admin
- 2: Manager
- 3: Employee

## Permissões por Role
- **Admin (1)**: Todas as permissões
- **Manager (2)**: Gerenciar funcionários, visualizar relatórios
- **Employee (3)**: Visualizar próprio perfil, alterar própria senha

- **Público**: Rotas que não requerem autenticação
- **Autenticado**: Rotas que requerem token válido
- **Proprietário**: Rotas que requerem ser o dono do recurso
- **Administrador**: Rotas que requerem privilégios de admin

### Níveis de Acesso:
- `position: 1` = Administrador
- `position: 2+` = Usuário comum
- `isActive: true` = Conta ativa (obrigatório)

## 🚀 Como Usar

### 1. **Registro de Usuário** (Público)
```http
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "MinhaSenh@123",
  "position": 2,
  "isActive": true
}
```

### 2. **Login** (Público)
```http
POST /api/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "MinhaSenh@123"
}
```

**Resposta:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "position": 2,
    "isActive": true
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### 3. **Refresh Token** (Público)
```http
POST /api/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. **Rotas Protegidas**
Para acessar rotas protegidas, inclua o token no header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Rotas Disponíveis

### Rotas Públicas
- `POST /api/login` - Login
- `POST /api/refresh-token` - Renovar token
- `POST /api/users` - Registro de usuário

### Rotas Autenticadas
- `GET /api/profile` - Perfil do usuário logado

### Rotas Administrativas (Admin apenas)
- `GET /api/users` - Listar todos os usuários

### Rotas do Proprietário
- `GET /api/users/:id` - Ver perfil próprio
- `PUT /api/users/:id` - Atualizar perfil próprio
- `DELETE /api/users/:id` - Deletar conta própria

## 🔧 Exemplos de Uso

### Obter Perfil do Usuário Logado
```http
GET /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Listar Todos os Usuários (Admin)
```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Atualizar Perfil Próprio
```http
PUT /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.santos@example.com"
}
```

## ⚠️ Códigos de Erro

- `401 Unauthorized`: Token ausente, inválido ou expirado
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `400 Bad Request`: Dados inválidos

## 🛡️ Segurança

- Tokens expiram em 24 horas
- Refresh tokens expiram em 7 dias
- Senhas são criptografadas com bcrypt
- Verificação de usuário ativo em todas as operações
- Tokens incluem validação de issuer e audience

## 🔄 Fluxo de Renovação de Token

1. Quando o access token expira (401), use o refresh token
2. Chame `/api/refresh-token` com o refresh token
3. Receba um novo access token válido
4. Continue usando o novo access token

## 🎯 Middleware Disponível

- `AuthorizationMiddleware.authenticate` - Verifica token válido
- `AuthorizationMiddleware.checkOwnership` - Verifica se é o dono do recurso
- `AuthorizationMiddleware.checkAdmin` - Verifica se é administrador
- `AuthorizationMiddleware.optionalAuth` - Autenticação opcional

# Sistema de Roles/Permissões

## 🎯 Visão Geral

Sistema de controle de acesso baseado em roles usando o campo `position` do usuário. Quanto menor o número, maior o nível de acesso.

## 📋 Hierarquia de Roles

```typescript
enum UserRole {
    SUPER_ADMIN = 1,    // Acesso total ao sistema
    ADMIN = 2,          // Gerenciamento de usuários e dados
    MANAGER = 3,        // Gerenciamento de equipe
    EMPLOYEE = 4,       // Acesso básico e dados próprios
    GUEST = 5           // Acesso apenas para visualização
}
```

## 🔐 Tipos de Middleware

### 1. **requireRole(minRole)** - Nível Mínimo
Permite acesso para users com role igual ou superior (número menor ou igual).

```typescript
// Apenas ADMIN ou SUPER_ADMIN (position <= 2)
router.get('/admin/users', 
    AuthorizationMiddleware.authenticate, 
    RoleMiddleware.requireRole(UserRole.ADMIN),
    UserController.findAll
);
```

### 2. **requireExactRole(role)** - Role Exato
Permite acesso apenas para users com role exato.

```typescript
// Apenas EMPLOYEE (position = 4)
router.get('/employee/tasks', 
    AuthorizationMiddleware.authenticate, 
    RoleMiddleware.requireExactRole(UserRole.EMPLOYEE),
    (req, res) => res.json({ message: 'Employee tasks' })
);
```

### 3. **requireAnyRole([roles])** - Múltiplos Roles
Permite acesso para users que tenham qualquer um dos roles especificados.

```typescript
// ADMIN ou MANAGER (position = 2 ou 3)
router.get('/admin-manager/content', 
    AuthorizationMiddleware.authenticate, 
    RoleMiddleware.requireAnyRole([UserRole.ADMIN, UserRole.MANAGER]),
    (req, res) => res.json({ message: 'Content management' })
);
```

### 4. **checkOwnershipOrRole(minRole)** - Proprietário OU Role
Permite acesso se for o dono do recurso OU tiver role mínima.

```typescript
// Próprio usuário OU admin+
router.get('/users/:id', 
    AuthorizationMiddleware.authenticate, 
    RoleMiddleware.checkOwnershipOrRole(UserRole.ADMIN),
    UserController.findById
);
```

## 🎛️ Permissões por Role

### SUPER_ADMIN (position = 1)
- `manage_all_users`
- `manage_system_settings`
- `view_all_data`
- `delete_any_data`
- `manage_roles`
- `system_maintenance`

### ADMIN (position = 2)
- `manage_users`
- `view_all_data`
- `delete_user_data`
- `manage_content`
- `view_reports`

### MANAGER (position = 3)
- `manage_team`
- `view_team_data`
- `create_content`
- `edit_content`
- `view_reports`

### EMPLOYEE (position = 4)
- `view_own_data`
- `edit_own_profile`
- `create_content`
- `view_public_content`

### GUEST (position = 5)
- `view_public_content`
- `edit_own_profile`

## 🚀 Exemplos de Uso

### Criar usuários com diferentes roles:

```json
// Super Admin
POST /api/users
{
  "name": "Super Admin",
  "email": "superadmin@example.com",
  "password": "SuperAdmin123@",
  "position": 1,
  "isActive": true
}

// Admin
POST /api/users
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Admin123@",
  "position": 2,
  "isActive": true
}

// Manager
POST /api/users
{
  "name": "Manager User",
  "email": "manager@example.com",
  "password": "Manager123@",
  "position": 3,
  "isActive": true
}

// Employee
POST /api/users
{
  "name": "Employee User",
  "email": "employee@example.com",
  "password": "Employee123@",
  "position": 4,
  "isActive": true
}
```

### Verificar permissões do usuário logado:

```http
GET /api/my-permissions
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta:**
```json
{
  "userId": 1,
  "role": "Super Admin",
  "permissions": [
    "manage_all_users",
    "manage_system_settings",
    "view_all_data",
    "delete_any_data",
    "manage_roles",
    "system_maintenance"
  ]
}
```

## 📊 Matriz de Acesso

| Rota | Super Admin | Admin | Manager | Employee | Guest |
|------|-------------|--------|---------|----------|-------|
| `GET /users` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `GET /users/:id` (próprio) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `GET /users/:id` (outros) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `PUT /users/:id` (próprio) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `PUT /users/:id` (outros) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `DELETE /users/:id` (próprio) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `DELETE /users/:id` (outros) | ✅ | ✅ | ❌ | ❌ | ❌ |

## 🔧 Verificação de Permissões

```typescript
// Verificar se usuário tem permissão específica
const hasPermission = RoleMiddleware.hasPermission(userPosition, 'manage_users');

// Obter todas as permissões do usuário
const permissions = RoleMiddleware.getUserPermissions(userPosition);

// Obter nome do role
const roleName = RoleMiddleware.getRoleName(userPosition);
```

## ⚠️ Códigos de Erro

- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão para acessar (role insuficiente)
- `404 Not Found`: Recurso não encontrado

## 🎨 Personalização

Para adicionar novos roles ou permissões:

1. **Adicionar novo role:**
```typescript
enum UserRole {
    SUPER_ADMIN = 1,
    ADMIN = 2,
    MANAGER = 3,
    SUPERVISOR = 4,  // Novo role
    EMPLOYEE = 5,
    GUEST = 6
}
```

2. **Adicionar permissões:**
```typescript
case UserRole.SUPERVISOR:
    return [
        'manage_small_team',
        'view_team_data',
        'create_reports'
    ];
```

3. **Usar nas rotas:**
```typescript
router.get('/supervisor/reports', 
    AuthorizationMiddleware.authenticate, 
    RoleMiddleware.requireRole(UserRole.SUPERVISOR),
    // controller
);
```

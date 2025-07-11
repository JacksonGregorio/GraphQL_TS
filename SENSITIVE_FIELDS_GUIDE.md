# 🛡️ Sistema de Campos Sensíveis

## 📋 Campos Atualmente Protegidos

Os seguintes campos **NUNCA** são retornados nas APIs GraphQL:

```typescript
export const SENSITIVE_FIELDS = [
  'password',              // Senha do usuário
  'refreshToken',          // Token de refresh
  'lastLoginIp',           // IP do último login
  'resetPasswordToken',    // Token para reset de senha
  'emailVerificationToken', // Token de verificação de email
  'twoFactorSecret',       // Segredo do 2FA
  'apiKey',                // Chave API privada
  'internalNotes'          // Notas internas da empresa
];
```

## 🔧 Como Funciona

### 1. **Nas Queries Sequelize**
```typescript
// Antes (manual)
const user = await User.findByPk(id, {
  attributes: { exclude: ['password'] }
});

// Depois (automatizado)
const user = await User.findByPk(id, {
  attributes: getSafeAttributes()  // Exclui TODOS os campos sensíveis
});
```

### 2. **No Retorno das Funções**
```typescript
// Antes (manual)
const { password, ...userWithoutPassword } = user.toJSON();
return userWithoutPassword;

// Depois (automatizado)
return safeUserReturn(user);  // Remove TODOS os campos sensíveis
```

## 🚀 Como Adicionar Novos Campos Sensíveis

### Passo 1: Adicionar no Array
```typescript
// src/utils/SecurityUtils.ts
export const SENSITIVE_FIELDS = [
  'password',
  'refreshToken',
  'lastLoginIp',
  'resetPasswordToken',
  'emailVerificationToken',
  'twoFactorSecret',
  'apiKey',
  'internalNotes',
  // ➕ NOVOS CAMPOS AQUI
  'creditCardNumber',      // Número do cartão
  'bankAccount',           // Conta bancária
  'socialSecurityNumber',  // CPF/SSN
  'phoneNumber',           // Telefone (se sensível)
  'address',               // Endereço completo
  'salary',                // Salário
  'employeeId',            // ID interno do funcionário
  'personalDocuments'      // Documentos pessoais
];
```

### Passo 2: Automaticamente Aplicado
Assim que você adicionar no array, **todos os resolvers** automaticamente começam a excluir esses campos!

## 🎯 Exemplos Práticos

### Cenário 1: Adicionando Campo `salary`
```typescript
// 1. Adicionar no SENSITIVE_FIELDS
export const SENSITIVE_FIELDS = [
  'password',
  'salary',  // ← NOVO CAMPO
  // ...outros campos
];

// 2. Pronto! Agora salary nunca é retornado
query {
  user(id: 1) {
    name
    email
    salary  # ← Este campo não aparecerá no resultado
  }
}
```

### Cenário 2: Campos Temporariamente Sensíveis
```typescript
// Para excluir campos específicos em uma query
const user = await User.findByPk(id, {
  attributes: getSafeAttributes(['temporaryField', 'anotherField'])
});
```

## 🔒 Níveis de Segurança

### Nível 1: Sempre Oculto
```typescript
SENSITIVE_FIELDS = ['password', 'apiKey', 'twoFactorSecret'];
```

### Nível 2: Baseado em Permissão
```typescript
// Futuramente, você pode criar:
function getSafeAttributesForRole(userRole: UserRole, additionalExcludes: string[] = []) {
  let excludeFields = [...SENSITIVE_FIELDS];
  
  if (userRole !== UserRole.ADMIN) {
    excludeFields.push('salary', 'internalNotes', 'employeeId');
  }
  
  if (userRole === UserRole.EMPLOYEE) {
    excludeFields.push('email', 'phoneNumber');
  }
  
  return { exclude: [...excludeFields, ...additionalExcludes] };
}
```

### Nível 3: Baseado em Contexto
```typescript
// Por exemplo, ocultar dados pessoais em APIs públicas
function getSafeAttributesForContext(context: 'public' | 'private' | 'internal') {
  let excludeFields = [...SENSITIVE_FIELDS];
  
  if (context === 'public') {
    excludeFields.push('email', 'phoneNumber', 'address');
  }
  
  return { exclude: excludeFields };
}
```

## 🧪 Testando a Segurança

### Query de Teste
```graphql
query TestSensitiveFields {
  user(id: 1) {
    id
    name
    email
    password        # ← Não deve aparecer
    apiKey          # ← Não deve aparecer
    salary          # ← Não deve aparecer (se adicionado)
    createdAt
    updatedAt
  }
}
```

### Resultado Esperado
```json
{
  "data": {
    "user": {
      "id": "1",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
      // password, apiKey, salary não aparecem!
    }
  }
}
```

## 🎯 Vantagens do Sistema

1. **Segurança Centralizada**: Um local para gerenciar todos os campos sensíveis
2. **Automatização**: Não precisa lembrar de excluir em cada query
3. **Consistência**: Todos os resolvers seguem a mesma regra
4. **Flexibilidade**: Pode adicionar exclusões específicas quando necessário
5. **Auditoria**: Fácil de ver quais campos são considerados sensíveis

**Resultado**: Seus dados sensíveis ficam protegidos automaticamente em toda a aplicação! 🔒

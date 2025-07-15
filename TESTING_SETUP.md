# 🧪 Sistema de Testes com Jest

## 📋 **Configuração Completa**

### **✅ Dependências Instaladas:**
- `jest` - Framework de testes
- `@types/jest` - Tipos TypeScript para Jest
- `ts-jest` - Preset para TypeScript
- `supertest` - Testes de API HTTP
- `@types/supertest` - Tipos para supertest

### **✅ Configuração:**
- `jest.config.js` - Configuração do Jest
- `src/__tests__/setup.ts` - Setup global dos testes
- Scripts no `package.json`

## 🏗️ **Estrutura dos Testes:**

```
src/
├── __tests__/
│   ├── setup.ts                    # Configuração global
│   ├── models/
│   │   └── User.test.ts           # Testes do modelo User
│   ├── routes/
│   │   └── auth.test.ts           # Testes das rotas REST
│   ├── graphql/
│   │   └── resolvers.test.ts      # Testes do GraphQL
│   └── utils/
│       └── PasswordUtils.test.ts  # Testes dos utilitários
```

## 🚀 **Comandos Disponíveis:**

### **Executar todos os testes:**
```bash
npm test
```

### **Executar testes em modo watch:**
```bash
npm run test:watch
```

### **Executar testes com coverage:**
```bash
npm run test:coverage
```

### **Executar teste específico:**
```bash
npm test -- User.test.ts
```

### **Executar testes por padrão:**
```bash
npm test -- --testNamePattern="deve fazer login"
```

## 🎯 **Tipos de Testes Criados:**

### **1. Testes de Modelo (User.test.ts):**
- ✅ Criação de usuários
- ✅ Validações de email único
- ✅ Operações CRUD
- ✅ Validações de dados obrigatórios

### **2. Testes de Rotas REST (auth.test.ts):**
- ✅ Login com credenciais válidas/inválidas
- ✅ Listagem de usuários (admin)
- ✅ Criação de usuários
- ✅ Autenticação e autorização

### **3. Testes GraphQL (resolvers.test.ts):**
- ✅ Queries: users, me, getUsersWithCriteria
- ✅ Mutations: login, createUser
- ✅ Autenticação e autorização
- ✅ Validações de entrada

### **4. Testes de Utilitários (PasswordUtils.test.ts):**
- ✅ Validação de senhas
- ✅ Hash de senhas
- ✅ Verificação de senhas

## 📊 **Exemplo de Resultado:**

```
PASS  src/__tests__/models/User.test.ts
PASS  src/__tests__/routes/auth.test.ts
PASS  src/__tests__/graphql/resolvers.test.ts
PASS  src/__tests__/utils/PasswordUtils.test.ts

Test Suites: 4 passed, 4 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        3.5 s
```

## 🔧 **Configurações do Jest:**

### **Ambiente:**
- `testEnvironment: 'node'` - Para APIs Node.js
- `preset: 'ts-jest'` - Para TypeScript

### **Cobertura:**
- Exclui migrations e seeders
- Relatórios em texto, HTML e LCOV
- Diretório: `coverage/`

### **Timeout:**
- Global: 30 segundos
- Para operações de banco de dados

## 🛠️ **Setup dos Testes:**

### **Banco de Dados:**
- Conecta automaticamente antes dos testes
- Recria tabelas entre testes (`sync({ force: true })`)
- Fecha conexões após todos os testes

### **Autenticação:**
- Cria usuários de teste
- Gera tokens JWT válidos
- Testa diferentes níveis de permissão

## 📈 **Próximos Passos:**

1. **Adicionar mais testes:**
   - Testes de integração completos
   - Testes de performance
   - Testes de segurança

2. **Configurar CI/CD:**
   - GitHub Actions
   - Testes automáticos no push

3. **Mocking:**
   - Mock de serviços externos
   - Mock de banco de dados

4. **Testes E2E:**
   - Cypress ou Playwright
   - Testes de interface completa

## 🎯 **Comandos Úteis:**

```bash
# Executar teste específico
npm test User.test.ts

# Executar testes com detalhes
npm test -- --verbose

# Executar testes e gerar coverage
npm run test:coverage

# Executar testes em modo debug
npm test -- --runInBand --detectOpenHandles

# Executar testes silenciosamente
npm test -- --silent
```

## ✅ **Testes Prontos para Usar!**

Execute `npm test` para ver todos os testes funcionando! 🚀

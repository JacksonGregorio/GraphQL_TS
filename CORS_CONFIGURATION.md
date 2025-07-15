# 🌐 Configuração CORS - Resolvendo Erro de Frontend

## ❌ **Erro Original:**
```
Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'http://localhost:8080' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## ✅ **Solução Aplicada:**

### **1. CORS Configurado para Rotas REST (`/api/*`)**
```typescript
app.use(cors({
  origin: [
    'http://localhost:8080',    // Seu frontend
    'http://localhost:3000',    // Mesmo servidor
    'http://localhost:4200',    // Angular padrão
    'http://localhost:5173',    // Vite padrão
    'http://127.0.0.1:8080',    // Alternativa local
    'http://127.0.0.1:5173'     // Vite alternativa
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **2. CORS Configurado para GraphQL (`/graphql`)**
```typescript
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),  // ← CORS habilitado
  express.json(),
  expressMiddleware(server, {
    context: createGraphQLContext,
  })
);
```

## 🚀 **Como Testar:**

### **1. Reiniciar o Servidor**
```powershell
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
# ou
npx ts-node src/app.ts
```

### **2. Testar REST API**
```javascript
// Frontend (JavaScript)
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: '123456'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### **3. Testar GraphQL**
```javascript
// Frontend (JavaScript)
fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SEU_TOKEN_AQUI'
  },
  body: JSON.stringify({
    query: `
      query {
        users {
          id
          name
          email
        }
      }
    `
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔧 **Origens Permitidas:**

- ✅ `http://localhost:8080` (seu frontend)
- ✅ `http://localhost:3000` (mesmo servidor)
- ✅ `http://localhost:4200` (Angular)
- ✅ `http://localhost:5173` (Vite)
- ✅ `http://127.0.0.1:8080` (IP local)
- ✅ `http://127.0.0.1:5173` (IP local Vite)

## 📝 **Headers Permitidos:**

- ✅ `Content-Type` (para JSON)
- ✅ `Authorization` (para JWT)

## 🎯 **Métodos Permitidos:**

- ✅ `GET` (buscar dados)
- ✅ `POST` (criar/login)
- ✅ `PUT` (atualizar)
- ✅ `DELETE` (deletar)
- ✅ `OPTIONS` (preflight)

## 🚨 **Se ainda tiver erro:**

### **Adicionar nova origem:**
```typescript
origin: [
  'http://localhost:8080',
  'SEU_NOVO_FRONTEND_URL'  // ← Adicione aqui
],
```

### **Verificar URL exata:**
```javascript
// No console do navegador
console.log(window.location.origin);
```

## ✅ **Resultado Esperado:**

Após reiniciar o servidor, as requisições do frontend devem funcionar normalmente sem erro de CORS! 🎉

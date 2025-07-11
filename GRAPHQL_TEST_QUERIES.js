/* 
🧪 TESTE PRÁTICO - COLE ISTO NO GRAPHQL STUDIO
📍 URL: http://localhost:3000/graphql
*/

// 1. PRIMEIRO: Faça login para obter o token
mutation Login {
  login(input: {
    email: "admin@example.com"
    password: "123456"
  }) {
    tokens {
      accessToken
    }
    user {
      id
      name
      email
    }
  }
}

// 2. SEGUNDO: Configure o Header com o token
// Headers: { "Authorization": "Bearer SEU_TOKEN_AQUI" }

// 3. TERCEIRO: Teste esta query (SÓ EMAIL)
query GetUserMinimal {
  user(id: 1) {
    email
  }
}

// 4. QUARTO: Teste esta query (TODOS OS DADOS)
query GetUserComplete {
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

// 5. QUINTO: Compare os logs no console do servidor
// Você deve ver a diferença nos campos solicitados!

/* 
🔍 LOGS ESPERADOS:

Para query mínima:
🎯 Campos solicitados: ['email']
🗃️ Atributos Sequelize: ['id', 'email']

Para query completa:
🎯 Campos solicitados: ['id', 'name', 'email', 'position', 'isActive', 'createdAt', 'updatedAt']
🗃️ Atributos Sequelize: ['id', 'name', 'email', 'position', 'isActive', 'createdAt', 'updatedAt']
*/

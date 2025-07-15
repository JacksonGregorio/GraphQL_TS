import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { sequelize } from './models';
import routes from './routes';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createGraphQLContext, GraphQLContext } from './graphql/context';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração CORS para permitir requisições do frontend
app.use(cors({
  origin: [
    'http://localhost:8080',    // Frontend Vue/React/Angular
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await sequelize.sync();
  

  await server.start();
  
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: [
        'http://localhost:8080',    // Frontend Vue/React/Angular
        'http://localhost:3000',    // Mesmo servidor
        'http://localhost:4200',    // Angular padrão
        'http://localhost:5173',    // Vite padrão
        'http://127.0.0.1:8080',    // Alternativa local
        'http://127.0.0.1:5173'     // Vite alternativa
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }),
    express.json(),
    expressMiddleware(server, {
      context: createGraphQLContext,
    })
  );
  
  app.listen(PORT, () => {
    console.log(` Server ready at http://localhost:${PORT}/graphql`);
    console.log(` GraphQL Studio: http://localhost:${PORT}/graphql`);
    console.log(` REST API: http://localhost:${PORT}/api`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
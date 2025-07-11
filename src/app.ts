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
    cors<cors.CorsRequest>(),
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
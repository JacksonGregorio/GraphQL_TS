import { sequelize } from '../models';

// Configurações globais para os testes
beforeAll(async () => {
  // Conectar ao banco de dados de teste
  await sequelize.authenticate();
  console.log('✅ Banco de dados conectado para testes');
});

// Limpar dados entre testes
beforeEach(async () => {
  // Sincronizar tabelas (recriar se necessário)
  await sequelize.sync({ force: true });
});

// Fechar conexões após todos os testes
afterAll(async () => {
  await sequelize.close();
  console.log('🔒 Conexão com banco de dados fechada');
});

// Configuração de timeout global
jest.setTimeout(30000);

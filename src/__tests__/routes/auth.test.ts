import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../../routes';
import { sequelize } from '../../models';
import { User } from '../../models/User';
import { PasswordUtils } from '../../utils/PasswordUtils';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar usuário para teste
      await User.create({
        name: 'João Silva',
        email: 'joao@test.com',
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@test.com',
          password: 'MinhaSenh@123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login realizado com sucesso');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('joao@test.com');
      expect(response.body.user.password).toBeUndefined(); // Senha não deve ser retornada
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('deve falhar com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@test.com',
          password: 'senhaErrada'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });

    it('deve falhar com email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@test.com',
          password: 'MinhaSenh@123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });

    it('deve falhar com dados faltando', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@test.com'
          // password faltando
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email e senha são obrigatórios');
    });
  });
});

describe('User Routes', () => {
  let authToken: string;
  let adminUser: User;

  beforeEach(async () => {
    // Criar usuário admin
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: await PasswordUtils.hashPassword('AdminPass123'),
      position: 1, // Admin
      isActive: true
    });

    // Fazer login para obter token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'AdminPass123'
      });

    authToken = loginResponse.body.accessToken;
  });

  describe('GET /api/users', () => {
    it('deve listar usuários com autenticação de admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('deve falhar sem autenticação', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('deve criar novo usuário', async () => {
      const userData = {
        name: 'Novo Usuário',
        email: 'novo@test.com',
        password: 'NovaSenh@123',
        position: 4,
        isActive: true
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Novo Usuário');
      expect(response.body.email).toBe('novo@test.com');
      expect(response.body.password).toBeUndefined(); // Senha não deve ser retornada
    });

    it('deve falhar com dados inválidos', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'Usuário Sem Email',
          // email faltando
          password: 'MinhaSenh@123'
        });

      expect(response.status).toBe(400);
    });
  });
});

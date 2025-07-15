import { resolvers } from '../../graphql/resolvers';
import { User } from '../../models/User';
import { PasswordUtils } from '../../utils/PasswordUtils';
import { JwtUtils } from '../../utils/JwtUtils';

describe('GraphQL Resolvers', () => {
  describe('Query: users', () => {
    let adminUser: User;
    let regularUser: User;

    beforeEach(async () => {
      // Criar usuário admin
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: await PasswordUtils.hashPassword('AdminPass123'),
        position: 1, // Admin
        isActive: true
      });

      // Criar usuário regular
      regularUser = await User.create({
        name: 'Regular User',
        email: 'user@test.com',
        password: await PasswordUtils.hashPassword('UserPass123'),
        position: 4, // User
        isActive: true
      });
    });

    it('deve retornar usuários para admin autenticado', async () => {
      const context = {
        user: {
          userId: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          isActive: adminUser.isActive
        }
      };

      const result = await resolvers.Query.users(null, {}, context);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result.some(user => user.email === 'admin@test.com')).toBe(true);
      expect(result.some(user => user.email === 'user@test.com')).toBe(true);
    });

    it('deve falhar para usuário não autenticado', async () => {
      const context = { user: undefined };

      await expect(
        resolvers.Query.users(null, {}, context)
      ).rejects.toThrow('Authentication required');
    });

    it('deve falhar para usuário não-admin', async () => {
      const context = {
        user: {
          userId: regularUser.id,
          email: regularUser.email,
          name: regularUser.name,
          isActive: regularUser.isActive
        }
      };

      await expect(
        resolvers.Query.users(null, {}, context)
      ).rejects.toThrow('Access denied. Admin privileges required.');
    });
  });

  describe('Query: me', () => {
    let user: User;

    beforeEach(async () => {
      user = await User.create({
        name: 'João Silva',
        email: 'joao@test.com',
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      });
    });

    it('deve retornar dados do usuário autenticado', async () => {
      const context = {
        user: {
          userId: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive
        }
      };

      const result = await resolvers.Query.me(null, {}, context);

      expect(result.id).toBe(user.id);
      expect(result.name).toBe('João Silva');
      expect(result.email).toBe('joao@test.com');
      expect(result.password).toBeUndefined(); // Senha não deve ser retornada
    });

    it('deve falhar para usuário não autenticado', async () => {
      const context = { user: undefined };

      await expect(
        resolvers.Query.me(null, {}, context)
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('Mutation: login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'João Silva',
        email: 'joao@test.com',
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const input = {
        email: 'joao@test.com',
        password: 'MinhaSenh@123'
      };

      const result = await resolvers.Mutation.login(null, { input });

      expect(result.message).toBe('Login successful');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('joao@test.com');
      expect(result.user.password).toBeUndefined(); // Senha não deve ser retornada
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.tokens.expiresIn).toBe('24h');
    });

    it('deve falhar com credenciais inválidas', async () => {
      const input = {
        email: 'joao@test.com',
        password: 'senhaErrada'
      };

      await expect(
        resolvers.Mutation.login(null, { input })
      ).rejects.toThrow('Invalid email or password');
    });

    it('deve falhar com email inexistente', async () => {
      const input = {
        email: 'naoexiste@test.com',
        password: 'MinhaSenh@123'
      };

      await expect(
        resolvers.Mutation.login(null, { input })
      ).rejects.toThrow('Invalid email or password');
    });

    it('deve falhar com dados faltando', async () => {
      const input = {
        email: 'joao@test.com'
        // password faltando
      };

      await expect(
        resolvers.Mutation.login(null, { input })
      ).rejects.toThrow('Email and password are required');
    });
  });

  describe('Mutation: createUser', () => {
    it('deve criar usuário com dados válidos', async () => {
      const input = {
        name: 'Novo Usuário',
        email: 'novo@test.com',
        password: 'NovaSenh@123',
        position: 4,
        isActive: true
      };

      const result = await resolvers.Mutation.createUser(null, { input });

      expect(result.name).toBe('Novo Usuário');
      expect(result.email).toBe('novo@test.com');
      expect(result.position).toBe(4);
      expect(result.isActive).toBe(true);
      expect(result.password).toBeUndefined(); // Senha não deve ser retornada
    });

    it('deve falhar com senha fraca', async () => {
      const input = {
        name: 'Novo Usuário',
        email: 'novo@test.com',
        password: '123', // Senha muito fraca
        position: 4,
        isActive: true
      };

      await expect(
        resolvers.Mutation.createUser(null, { input })
      ).rejects.toThrow('Password must be at least 8 characters');
    });
  });
});

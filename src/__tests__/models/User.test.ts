import { User } from '../../models/User';
import { PasswordUtils } from '../../utils/PasswordUtils';

describe('User Model', () => {
  describe('Criação de usuário', () => {
    it('deve criar um usuário com dados válidos', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@test.com',
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@test.com');
      expect(user.position).toBe(4);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('deve falhar ao criar usuário com email duplicado', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@test.com',
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      };

      // Criar primeiro usuário
      await User.create(userData);

      // Tentar criar segundo usuário com mesmo email
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('deve falhar ao criar usuário sem dados obrigatórios', async () => {
      await expect(User.create({
        name: 'João Silva',
        // email faltando
        password: 'senha123',
        position: 4,
        isActive: true
      } as any)).rejects.toThrow();
    });
  });

  describe('Validações', () => {
    it('deve validar email único', async () => {
      const user1 = await User.create({
        name: 'User 1',
        email: 'user1@test.com',
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      });

      await expect(User.create({
        name: 'User 2',
        email: 'user1@test.com', // Email duplicado
        password: await PasswordUtils.hashPassword('MinhaSenh@123'),
        position: 4,
        isActive: true
      })).rejects.toThrow();
    });
  });

  describe('Operações CRUD', () => {
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

    it('deve buscar usuário por ID', async () => {
      const foundUser = await User.findByPk(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('joao@test.com');
    });

    it('deve atualizar usuário', async () => {
      await user.update({ name: 'João Silva Junior' });
      expect(user.name).toBe('João Silva Junior');
    });

    it('deve deletar usuário', async () => {
      await user.destroy();
      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });
  });
});

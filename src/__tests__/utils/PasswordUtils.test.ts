import { PasswordUtils } from '../../utils/PasswordUtils';

describe('PasswordUtils', () => {
  describe('validatePassword', () => {
    it('deve validar senha válida', () => {
      const validPasswords = [
        'MinhaSenh@123',
        'OutraSenh@456',
        'Password123!',
        'ValidPass1@'
      ];

      validPasswords.forEach(password => {
        expect(PasswordUtils.validatePassword(password)).toBe(true);
      });
    });

    it('deve rejeitar senhas inválidas', () => {
      const invalidPasswords = [
        '123456',           // Sem letras
        'password',         // Sem números e maiúsculas
        'PASSWORD',         // Sem números e minúsculas
        'Pass123',          // Menos de 8 caracteres
        'password123',      // Sem maiúsculas
        'PASSWORD123',      // Sem minúsculas
        'Password',         // Sem números
        ''                  // Vazia
      ];

      invalidPasswords.forEach(password => {
        expect(PasswordUtils.validatePassword(password)).toBe(false);
      });
    });
  });

  describe('hashPassword', () => {
    it('deve gerar hash da senha', async () => {
      const password = 'MinhaSenh@123';
      const hash = await PasswordUtils.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // Hash bcrypt é longo
    });

    it('deve gerar hashes diferentes para mesma senha', async () => {
      const password = 'MinhaSenh@123';
      const hash1 = await PasswordUtils.hashPassword(password);
      const hash2 = await PasswordUtils.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('dev verificar senha correta', async () => {
      const password = 'MinhaSenh@123';
      const hash = await PasswordUtils.hashPassword(password);

      const isValid = await PasswordUtils.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('deve rejeitar senha incorreta', async () => {
      const password = 'MinhaSenh@123';
      const wrongPassword = 'SenhaErrada123';
      const hash = await PasswordUtils.hashPassword(password);

      const isValid = await PasswordUtils.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });
});

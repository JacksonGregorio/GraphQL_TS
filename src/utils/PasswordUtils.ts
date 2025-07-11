import bcrypt from 'bcrypt';

export class PasswordUtils {
    private static readonly SALT_ROUNDS = 12;

    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    static validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
}

import jwt from 'jsonwebtoken';
import secretConfig from '../config/secret.json';

interface JwtPayload {
    userId: number;
    email: string;
    name: string;
    isActive: boolean;
}

export class JwtUtils {
    private static readonly SECRET_KEY = secretConfig.jwt_secret;
    private static readonly EXPIRES_IN = '24h'; 

    static generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.SECRET_KEY, {
            expiresIn: this.EXPIRES_IN,
            issuer: 'my-sequelize-app',
            audience: 'app-users'
        });
    }

    static verifyToken(token: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(token, this.SECRET_KEY, {
                issuer: 'my-sequelize-app',
                audience: 'app-users'
            }) as JwtPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }

    static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader) return null;
        
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        
        return parts[1];
    }

    static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.SECRET_KEY, {
            expiresIn: '7d',
            issuer: 'my-sequelize-app',
            audience: 'app-users'
        });
    }
}

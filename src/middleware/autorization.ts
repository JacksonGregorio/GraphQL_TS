import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/JwtUtils';
import { User } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                name: string;
                isActive: boolean;
            };
        }
    }
}

export class AuthorizationMiddleware {
 
    static async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            
            const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);
            
            if (!token) {
                return res.status(401).json({ 
                    error: 'Access denied. No token provided.' 
                });
            }

           
            const decoded = JwtUtils.verifyToken(token);
            
            if (!decoded) {
                return res.status(401).json({ 
                    error: 'Invalid token.' 
                });
            }

            
            const user = await User.findByPk(decoded.userId);
            
            if (!user) {
                return res.status(401).json({ 
                    error: 'User not found.' 
                });
            }

            if (!user.isActive) {
                return res.status(401).json({ 
                    error: 'User account is inactive.' 
                });
            }

            // Adicionar informações do usuário ao request
            req.user = {
                userId: user.id,
                email: user.email,
                name: user.name,
                isActive: user.isActive
            };

            next();
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Authentication error' 
            });
        }
    }


    static checkOwnership(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.id);
            
            if (!req.user) {
                return res.status(401).json({ 
                    error: 'Authentication required.' 
                });
            }

            if (req.user.userId !== userId) {
                return res.status(403).json({ 
                    error: 'Access denied. You can only access your own resources.' 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Authorization error' 
            });
        }
    }


    static async checkAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    error: 'Authentication required.' 
                });
            }

            // Buscar informações completas do usuário
            const user = await User.findByPk(req.user.userId);
            
            if (!user) {
                return res.status(401).json({ 
                    error: 'User not found.' 
                });
            }

            // Verificar se é admin (position 1 = admin)
            if (user.position !== 1) {
                return res.status(403).json({ 
                    error: 'Access denied. Admin privileges required.' 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Authorization error' 
            });
        }
    }


    static async optionalAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);
            
            if (token) {
                const decoded = JwtUtils.verifyToken(token);
                
                if (decoded) {
                    const user = await User.findByPk(decoded.userId);
                    
                    if (user && user.isActive) {
                        req.user = {
                            userId: user.id,
                            email: user.email,
                            name: user.name,
                            isActive: user.isActive
                        };
                    }
                }
            }

            next();
        } catch (error) {
            


            next();
        }
    }
}

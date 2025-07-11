import { Request, Response } from 'express';
import { User } from '../models/User';
import { PasswordUtils } from '../utils/PasswordUtils';
import { JwtUtils } from '../utils/JwtUtils';

export class UserController {
    async create(req: Request, res: Response) {
        try {
            const { name, email, password, position, isActive } = req.body;
            
            if (!password) {
                return res.status(400).json({ error: 'Password is required' });
            }

            if (!PasswordUtils.validatePassword(password)) {
                return res.status(400).json({ 
                    error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
                });
            }

            const hashedPassword = await PasswordUtils.hashPassword(password);

            const user = await User.create({ 
                name, 
                email, 
                password: hashedPassword,
                position, 
                isActive 
            });

            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, password, position, isActive } = req.body;
            
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const updateData: any = { name, email, position, isActive };

            if (password) {
                if (!PasswordUtils.validatePassword(password)) {
                    return res.status(400).json({ 
                        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' 
                    });
                }
                updateData.password = await PasswordUtils.hashPassword(password);
            }

            await user.update(updateData);

            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.json(userWithoutPassword);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const user = await User.findOne({ where: { email } });
            
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const isPasswordValid = await PasswordUtils.verifyPassword(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            if (!user.isActive) {
                return res.status(401).json({ error: 'Account is inactive' });
            }

            const tokenPayload = {
                userId: user.id,
                email: user.email,
                name: user.name,
                isActive: user.isActive
            };

            const accessToken = JwtUtils.generateToken(tokenPayload);
            const refreshToken = JwtUtils.generateRefreshToken(tokenPayload);

            const { password: _, ...userWithoutPassword } = user.toJSON();
            
            res.json({ 
                message: 'Login successful', 
                user: userWithoutPassword,
                tokens: {
                    accessToken,
                    refreshToken,
                    expiresIn: '24h'
                }
            });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required' });
            }

            const decoded = JwtUtils.verifyToken(refreshToken);
            
            if (!decoded) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            const user = await User.findByPk(decoded.userId);
            
            if (!user || !user.isActive) {
                return res.status(401).json({ error: 'User not found or inactive' });
            }

            const tokenPayload = {
                userId: user.id,
                email: user.email,
                name: user.name,
                isActive: user.isActive
            };

            const newAccessToken = JwtUtils.generateToken(tokenPayload);

            res.json({
                message: 'Token refreshed successfully',
                accessToken: newAccessToken,
                expiresIn: '24h'
            });
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const user = await User.findByPk(req.user.userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }
}

export default new UserController();
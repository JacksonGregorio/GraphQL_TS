import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export enum UserRole {
    SUPER_ADMIN = 1,
    ADMIN = 2,
    MANAGER = 3,
    EMPLOYEE = 4,
    GUEST = 5
}

export class RoleMiddleware {
    static requireRole(minRole: UserRole) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'Authentication required' });
                }

                const user = await User.findByPk(req.user.userId);
                
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                if (!user.isActive) {
                    return res.status(401).json({ error: 'Account is inactive' });
                }

                if (user.position > minRole) {
                    return res.status(403).json({ 
                        error: `Access denied. Minimum role required: ${RoleMiddleware.getRoleName(minRole)}` 
                    });
                }

                next();
            } catch (error) {
                res.status(500).json({ 
                    error: error instanceof Error ? error.message : 'Role verification error' 
                });
            }
        };
    }

    static requireExactRole(role: UserRole) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'Authentication required' });
                }

                const user = await User.findByPk(req.user.userId);
                
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                if (!user.isActive) {
                    return res.status(401).json({ error: 'Account is inactive' });
                }

                if (user.position !== role) {
                    return res.status(403).json({ 
                        error: `Access denied. Required role: ${RoleMiddleware.getRoleName(role)}` 
                    });
                }

                next();
            } catch (error) {
                res.status(500).json({ 
                    error: error instanceof Error ? error.message : 'Role verification error' 
                });
            }
        };
    }

    static requireAnyRole(roles: UserRole[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'Authentication required' });
                }

                const user = await User.findByPk(req.user.userId);
                
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                if (!user.isActive) {
                    return res.status(401).json({ error: 'Account is inactive' });
                }

                if (!roles.includes(user.position as UserRole)) {
                    const roleNames = roles.map(r => RoleMiddleware.getRoleName(r)).join(', ');
                    return res.status(403).json({ 
                        error: `Access denied. Required roles: ${roleNames}` 
                    });
                }

                next();
            } catch (error) {
                res.status(500).json({ 
                    error: error instanceof Error ? error.message : 'Role verification error' 
                });
            }
        };
    }

    static checkOwnershipOrRole(minRole: UserRole) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'Authentication required' });
                }

                const user = await User.findByPk(req.user.userId);
                
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                if (!user.isActive) {
                    return res.status(401).json({ error: 'Account is inactive' });
                }

                const resourceUserId = parseInt(req.params.id);
                
                if (user.id === resourceUserId || user.position <= minRole) {
                    return next();
                }

                return res.status(403).json({ 
                    error: 'Access denied. You can only access your own resources or need higher privileges.' 
                });
            } catch (error) {
                res.status(500).json({ 
                    error: error instanceof Error ? error.message : 'Role verification error' 
                });
            }
        };
    }

    static getRoleName(role: UserRole): string {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return 'Super Admin';
            case UserRole.ADMIN:
                return 'Admin';
            case UserRole.MANAGER:
                return 'Manager';
            case UserRole.EMPLOYEE:
                return 'Employee';
            case UserRole.GUEST:
                return 'Guest';
            default:
                return 'Unknown';
        }
    }

    static getUserPermissions(position: number): string[] {
        switch (position) {
            case UserRole.SUPER_ADMIN:
                return [
                    'manage_all_users',
                    'manage_system_settings',
                    'view_all_data',
                    'delete_any_data',
                    'manage_roles',
                    'system_maintenance'
                ];
            case UserRole.ADMIN:
                return [
                    'manage_users',
                    'view_all_data',
                    'delete_user_data',
                    'manage_content',
                    'view_reports'
                ];
            case UserRole.MANAGER:
                return [
                    'manage_team',
                    'view_team_data',
                    'create_content',
                    'edit_content',
                    'view_reports'
                ];
            case UserRole.EMPLOYEE:
                return [
                    'view_own_data',
                    'edit_own_profile',
                    'create_content',
                    'view_public_content'
                ];
            case UserRole.GUEST:
                return [
                    'view_public_content',
                    'edit_own_profile'
                ];
            default:
                return [];
        }
    }

    static hasPermission(userPosition: number, permission: string): boolean {
        const permissions = RoleMiddleware.getUserPermissions(userPosition);
        return permissions.includes(permission);
    }
}

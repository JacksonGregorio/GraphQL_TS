import express from 'express';
import UserController from '../controllers/UserController';
import { AuthorizationMiddleware } from '../middleware/autorization';
import { RoleMiddleware, UserRole } from '../middleware/roles';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);

router.get('/my-permissions', 
    AuthorizationMiddleware.authenticate, 
    async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const permissions = RoleMiddleware.getUserPermissions(user.userId);
            const roleName = RoleMiddleware.getRoleName(user.userId as UserRole);
            
            res.json({
                userId: user.userId,
                role: roleName,
                permissions
            });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching permissions' });
        }
    }
);

export default router;

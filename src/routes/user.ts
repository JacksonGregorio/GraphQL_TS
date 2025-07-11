import express from 'express';
import UserController from '../controllers/UserController';
import { AuthorizationMiddleware } from '../middleware/autorization';
import { RoleMiddleware, UserRole } from '../middleware/roles';

const router = express.Router();

router.post('/', UserController.create);
router.get('/profile', AuthorizationMiddleware.authenticate, UserController.getProfile);
router.get('/', AuthorizationMiddleware.authenticate, RoleMiddleware.requireRole(UserRole.ADMIN), UserController.findAll);
router.get('/:id', AuthorizationMiddleware.authenticate, RoleMiddleware.checkOwnershipOrRole(UserRole.ADMIN), UserController.findById);
router.put('/:id', AuthorizationMiddleware.authenticate, RoleMiddleware.checkOwnershipOrRole(UserRole.ADMIN), UserController.update);
router.delete('/:id', AuthorizationMiddleware.authenticate, RoleMiddleware.checkOwnershipOrRole(UserRole.ADMIN), UserController.delete);

export default router;

import { User } from '../models/User';
import { PasswordUtils } from '../utils/PasswordUtils';
import { JwtUtils } from '../utils/JwtUtils';
import { RoleMiddleware, UserRole } from '../middleware/roles';
import { Op } from 'sequelize';
import { GraphQLContext } from './context';
import { getSafeAttributes, safeUserReturn } from '../utils/SecurityUtils';

export const resolvers = {
  Query: {
    async user(_: any, { id }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const requestedUserId = parseInt(id);
      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser) {
        throw new Error('User not found');
      }

      if (currentUser.id !== requestedUserId && currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied');
      }

      const user = await User.findByPk(requestedUserId, {
        attributes: getSafeAttributes()
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },

    async users(_: any, __: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser || currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      return await User.findAll({
        attributes: getSafeAttributes(),
        order: [['createdAt', 'DESC']]
      });
    },

    async me(_: any, __: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const user = await User.findByPk(context.user.userId, {
        attributes: getSafeAttributes()
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },

    async myPermissions(_: any, __: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const user = await User.findByPk(context.user.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const permissions = RoleMiddleware.getUserPermissions(user.position);
      const roleName = RoleMiddleware.getRoleName(user.position as UserRole);

      return {
        userId: user.id,
        role: roleName,
        permissions
      };
    },

    async searchUsers(_: any, { name, email, position, isActive, limit, offset }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser || currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const where: any = {};

      if (name) {
        where.name = { [Op.like]: `%${name}%` };
      }
      if (email) {
        where.email = { [Op.like]: `%${email}%` };
      }
      if (position !== undefined) {
        where.position = position;
      }
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      return await User.findAll({
        where,
        attributes: getSafeAttributes(),
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
    },

    async getUsersWithCriteria(_: any, { evenIds, minPosition, maxPosition, isActive, limit, offset }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser || currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Construir condições WHERE dinamicamente
      const whereConditions: any = {};
      
      // Filtrar por position maior que um valor
      if (minPosition !== undefined) {
        whereConditions.position = { [Op.gt]: minPosition };
      }
      
      // Filtrar por position menor que um valor
      if (maxPosition !== undefined) {
        whereConditions.position = {
          ...whereConditions.position,
          [Op.lt]: maxPosition
        };
      }
      
      // Filtrar por status ativo
      if (isActive !== undefined) {
        whereConditions.isActive = isActive;
      }
      
      // Buscar usuários
      let users = await User.findAll({
        where: whereConditions,
        attributes: getSafeAttributes(),
        limit: evenIds ? limit * 2 : limit, // Buscar mais se filtrar IDs pares
        offset,
        order: [['id', 'ASC']]
      });
      
      // Filtrar IDs pares se solicitado
      if (evenIds) {
        users = users.filter(user => user.id % 2 === 0);
        // Limitar novamente após filtrar
        users = users.slice(0, limit);
      }
      
      return users;
    }
  },

  Mutation: {
    async login(_: any, { input }: any) {
      const { email, password } = input;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await PasswordUtils.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is inactive');
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      };

      const accessToken = JwtUtils.generateToken(tokenPayload);
      const refreshToken = JwtUtils.generateRefreshToken(tokenPayload);

      return {
        message: 'Login successful',
        user: safeUserReturn(user),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: '24h'
        }
      };
    },

    async refreshToken(_: any, { input }: any) {
      const { refreshToken } = input;

      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      const decoded = JwtUtils.verifyToken(refreshToken);
      
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }

      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      };

      const newAccessToken = JwtUtils.generateToken(tokenPayload);

      return {
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        expiresIn: '24h'
      };
    },

    async createUser(_: any, { input }: any) {
      const { name, email, password, position, isActive } = input;

      if (!password) {
        throw new Error('Password is required');
      }

      if (!PasswordUtils.validatePassword(password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }

      const hashedPassword = await PasswordUtils.hashPassword(password);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        position,
        isActive
      });

      const { password: userPassword, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    },

    async updateUser(_: any, { id, input }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const userId = parseInt(id);
      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser) {
        throw new Error('User not found');
      }

      if (currentUser.id !== userId && currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied');
      }

      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const updateData: any = { ...input };

      if (input.password) {
        if (!PasswordUtils.validatePassword(input.password)) {
          throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        }
        updateData.password = await PasswordUtils.hashPassword(input.password);
      }

      await user.update(updateData);

      const { password: userPassword, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    },

    async deleteUser(_: any, { id }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const userId = parseInt(id);
      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser) {
        throw new Error('User not found');
      }

      if (currentUser.id !== userId && currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied');
      }

      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      await user.destroy();
      return true;
    },

    async activateUser(_: any, { id }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser || currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const user = await User.findByPk(id);
      
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: true });

      const { password: userPassword, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    },

    async deactivateUser(_: any, { id }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser || currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const user = await User.findByPk(id);
      
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: false });

      const { password: userPassword, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    },

    async changeUserRole(_: any, { id, position }: any, context: GraphQLContext) {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const currentUser = await User.findByPk(context.user.userId);
      
      if (!currentUser || currentUser.position > UserRole.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const user = await User.findByPk(id);
      
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ position });

      const { password: userPassword, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    }
  }
};

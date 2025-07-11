import { Request } from 'express';
import { JwtUtils } from '../utils/JwtUtils';

export interface GraphQLContext {
  user?: {
    userId: number;
    email: string;
    name: string;
    isActive: boolean;
  };
}

export async function createGraphQLContext({ req }: { req: Request }): Promise<GraphQLContext> {
  
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = undefined;
  
  if (token) {
    try {
      
      const decoded = JwtUtils.verifyToken(token);
      if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
        user = decoded as {
          userId: number;
          email: string;
          name: string;
          isActive: boolean;
        };
      }
    } catch (error) {
      
      console.log('Invalid token:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  return { user };
}

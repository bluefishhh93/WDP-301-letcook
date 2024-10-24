import { NextFunction, Request, RequestWithUser, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
//env
import { UserRole } from '@/@types/user.d';
import env from '@/util/validateEnv';
import { Logger } from '@/util/logger';

const { TokenExpiredError } = jwt;

const catchError = (res: Response, error: JsonWebTokenError) => {
  if (error instanceof TokenExpiredError) {
    return res.status(401).json({ message: 'Unauthorized: Token expired' });
  } else {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    Logger.warn('No token provided');
    res.status(403).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      Logger.warn(`Token expired for user ${(err as jwt.TokenExpiredError).expiredAt}`);
      res.status(401).json({ message: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      Logger.warn(`Invalid token: ${err.message}`);
      res.status(401).json({ message: 'Invalid token' });
    } else {
      Logger.error(`Failed to authenticate token: ${err}`);
      res.status(500).json({ message: 'Failed to authenticate token' });
    }
  }
};

// check role
const isValidRole = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const role = req.user.role;
  if (role === UserRole.ADMIN || role === UserRole.USER) {
    next();
  } else {
    res.status(403).send({ message: 'Invalid Role!' });
  }
};

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  console.log('Authenticating JWT');
  const token = req.cookies.accessToken;

  console.log('Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return catchError(res, error);
    } else {
      return res.status(500).send({ message: 'Internal server error!' });
    }
  }
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

const checkRole = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(403).json({ message: 'No user found!' });
    }
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized: Insufficient role!' });
    }
  };
};

export { authenticateJWT, isValidRole, requireAuth, verifyToken, checkRole };

// import { Request, Response, NextFunction } from 'express';
// import env from '@/util/validateEnv';

// /*
// Example usage:
//     router.use(apiKeyAuth);
// */


// export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
//   const apiKey = req.header('X-API-Key');
//   if (!apiKey || apiKey !== env.API_KEY) {
//     return res.status(401).json({ message: 'Invalid API Key' });
//   }
//   next();
// };
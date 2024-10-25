import { Request, Response, NextFunction } from 'express';

export const resolveIndexId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid ID syntax. ID must be an integer." });
  } else {
    next();
  }
};

export const checkForBodyInGetRequest = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'GET' && Object.keys(req.body).length > 0) {
    res.status(405).json({ error: 'Sending a body with a GET request is not supported' });
  } else {
    next();
  }
};
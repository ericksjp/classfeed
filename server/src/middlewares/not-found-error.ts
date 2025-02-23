import { Request, Response, NextFunction } from 'express';

// only a placeholder for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (_err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found --' });
};

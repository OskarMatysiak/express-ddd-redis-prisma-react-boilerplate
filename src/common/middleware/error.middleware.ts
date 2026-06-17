import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';



export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: err.flatten() });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal server error' });
};

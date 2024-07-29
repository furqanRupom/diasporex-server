import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { IErrorSources } from '../interface/Error';
import { ErrorHandler } from '../errors/Errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

class GlobalErrorHandler {
    handlers(error: any, req: Request, res: Response, next: NextFunction) {
        let statusCode = 500;
        let message = 'Something went wrong';
        let errorSources: IErrorSources[] = [{ path: '', message: 'Something went wrong' }];

        if (error instanceof ZodError) {
            const simplifiedError = ErrorHandler.handleZodError(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorSources = simplifiedError.errorSources;
        } else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const simplifiedError = ErrorHandler.handleDuplicateError(error);
                statusCode = simplifiedError.statusCode;
                message = simplifiedError.message;
                errorSources = simplifiedError.errorSources;
            } else if (error.code === 'P2003') {
                const simplifiedError = ErrorHandler.handleCastError(error);
                statusCode = simplifiedError.statusCode;
                message = simplifiedError.message;
                errorSources = simplifiedError.errorSources;
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            const simplifiedError = ErrorHandler.handleValidationError(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorSources = simplifiedError.errorSources;
        }

        return res.status(statusCode).json({ success: false, message, errorSources, stack: error?.stack });
    }
}

export const gloabalErrorHandler = new GlobalErrorHandler()

import { ZodError } from "zod";
import { IErrorSources } from "../interface/Error";
import { config } from "../config";
import { Prisma } from "@prisma/client";


class ErrorHandlers {
    /* zod error */
    handleZodError(error: ZodError) {
        const errorSources: IErrorSources[] = error.issues.map(issue => ({
            path: issue?.path[issue.path.length - 1],
            message: issue?.message,
        }));
        const statusCode = 400;

        return {
            statusCode,
            success: false,
            message: 'Zod Error',
            errorSources,
            stack: config.node_env === 'development' ? error?.stack : null,
        };
    }

    /* Prisma validation error */
    handleValidationError(error: Prisma.PrismaClientValidationError) {
        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: error.message,
            },
        ];

        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: 'Validation Error',
            errorSources,
        };
    }

    /* Prisma duplicate error */
    handleDuplicateError(error: Prisma.PrismaClientKnownRequestError) {
        if (error.code !== 'P2002') {
            throw error;
        }


        // @ts-ignore
        const errorSources: IErrorSources[] = error?.meta?.target.map((field: string) => ({
            path: field,
            message: `${field} already exists.`,
        }));

        const statusCode = 409;
        return {
            statusCode,
            success: false,
            message: 'Duplicate Entry Error',
            errorSources,
        };
    }

    /* Prisma cast error */
    handleCastError(error: Prisma.PrismaClientKnownRequestError) {
        if (error.code !== 'P2003') {
            throw error;
        }

        const errorSources: IErrorSources[] = [
            {
                path: '',
                message: 'Invalid data type provided.',
            },
        ];

        const statusCode = 400;
        return {
            statusCode,
            success: false,
            message: 'Cast Error',
            errorSources,
        };
    }
}

export const ErrorHandler = new ErrorHandlers();

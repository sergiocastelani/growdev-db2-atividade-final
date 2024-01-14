import { Response } from 'express'

export class ApiError extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
    }
}

export interface ControllerResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
}

export async function processAndRespond<T> (
    expressResponse: Response, 
    action : () => Promise<ControllerResponse<T>>
) 
{
    try {
        const result = await action();

        expressResponse.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data,
        });

    } catch (error) {
        if (error instanceof ApiError)
        {
            expressResponse.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        else
        {
            expressResponse.status(500).json({
                success: false,
                message: `Unknow server error:\n ${(error instanceof Error) ? error.message : ""}`
            });
        }
    }
}
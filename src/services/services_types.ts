export interface ServiceResponse<T>
{
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
}

export type ServiceResponseAsync<T> = Promise<ServiceResponse<T>>;

export class ApiError extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
    }
}

export function SuccessResult<T>(message: string, data?: T, statusCode: number = 200) : ServiceResponse<T> 
{
    return {
        success: true,
        message,
        statusCode,
        data
    };
}

export function ErrorResult<T>(statusCode: number, message: string) : ServiceResponse<T> 
{
    return {
        success: false,
        message,
        statusCode
    };
}

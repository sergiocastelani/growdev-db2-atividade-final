import { Request, Response } from "express";
import { AuthServive } from "../../services/auth_service";
import { UserService } from "../../services/user_service";

export async function authMiddleware(req: Request, res: Response, next: any)
{
    const authToken = req.header(process.env.AUTH_TOKEN_NAME!);

    const authServive= new AuthServive();
    const validateResult = authServive.validateToken(authToken ?? "--");

    if(!validateResult.success) 
        return res.status(validateResult.statusCode).json(validateResult);

    const userService = new UserService();
    const userResult = await userService.getById(validateResult.data?.id ?? 0);

    if(!userResult.success) 
        return res.status(validateResult.statusCode).json(validateResult);

    res.locals.user = userResult.data;

    next();
}
import { Request, Response } from "express";
import { AuthService } from "../../services/auth_service";
import { UserService } from "../../services/user_service";

export async function authMiddleware(req: Request, res: Response, next: any)
{
    let authToken = req.header(process.env.AUTH_TOKEN_NAME!);

    if(authToken && authToken.indexOf('Bearer ') === 0)
        authToken = authToken.substring(7, authToken.length);

    const authService = new AuthService();
    const validateResult = authService.validateToken(authToken ?? "--");

    if(!validateResult.success) 
        return res.status(validateResult.statusCode).json(validateResult);

    const userService = new UserService();
    const userResult = await userService.getById(validateResult.data?.id ?? 0);

    if(!userResult.success) 
        return res.status(userResult.statusCode).json(userResult);

    res.locals.user = userResult.data;

    next();
}
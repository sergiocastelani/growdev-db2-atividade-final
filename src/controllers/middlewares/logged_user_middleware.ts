import { Request, Response } from "express";
import { userDAO } from "../../daos/_setup";
import { AuthServive } from "../../services/auth_service";

export async function loggedUserMiddleware(req: Request, res: Response, next: any)
{
    const authToken = req.header(process.env.AUTH_TOKEN_NAME!);
    if(!authToken) 
        return next();

    const authServive= new AuthServive();
    const validateResult = authServive.validateToken(authToken ?? "");

    if(!validateResult.success) 
        next();

    const user = await userDAO.getById(validateResult.data!.id);
    if(user) 
        res.locals.user = user;

    next();
}
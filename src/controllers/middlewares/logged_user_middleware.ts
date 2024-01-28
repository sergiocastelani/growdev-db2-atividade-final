import { Request, Response } from "express";
import { userDAO } from "../../daos/_setup";
import { AUTH_TOKEN_NAME } from "./auth_middleware";

export async function loggedUserMiddleware(req: Request, res: Response, next: any)
{
    const authToken = req.header(AUTH_TOKEN_NAME);

    if(!authToken) 
        return next();

    const user = await userDAO.getByToken(authToken);
    if(!user) 
        return next();

    req.app.locals.user = user;

    next();
}
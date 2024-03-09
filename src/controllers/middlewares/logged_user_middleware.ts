import { Request, Response } from "express";
import { userDAO } from "../../daos/_setup";

export async function loggedUserMiddleware(req: Request, res: Response, next: any)
{
    const authToken = req.header(process.env.AUTH_TOKEN_NAME!);

    if(!authToken) 
        return next();

    const user = await userDAO.getByToken(authToken);
    if(!user) 
        return next();

    res.locals.user = user;

    next();
}
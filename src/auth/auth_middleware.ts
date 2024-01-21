import { Request, Response } from "express";
import { userDAO } from "../daos/_setup";

export const AUTH_TOKEN_NAME = 'authorization';

export async function authMiddleware(req: Request, res: Response, next: any)
{
    const authToken = req.header(AUTH_TOKEN_NAME);

    if(!authToken) 
    {
        res.status(401).json({ 
            success: false, 
            message: "Unauthorized", 
            data: null
        });
        return;
    }

    const user = await userDAO.getByToken(authToken);
    if(!user) 
    {
        res.status(401).json({ 
            success: false, 
            message: "Unauthorized", 
            data: null
        });
        return;
    }

    next();
}
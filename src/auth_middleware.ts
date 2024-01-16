import { Request, Response } from "express";
import { userDAO } from "./daos/_setup";

export default async function authMiddleware(req: Request, res: Response, next: any)
{
    const { authorization } = req.cookies;

    if(!authorization) 
    {
        res.status(401).json({ 
            success: false, 
            message: "Unauthorized", 
            data: null
        });
        return;
    }

    const user = await userDAO.getByToken(authorization);
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
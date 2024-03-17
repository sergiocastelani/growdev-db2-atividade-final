import { Request, Response } from "express";
import { userDAO } from "../../daos/_setup";
import { AuthServive } from "../../services/auth_service";

export async function authMiddleware(req: Request, res: Response, next: any)
{
    const authToken = req.header(process.env.AUTH_TOKEN_NAME!);

    const authServive= new AuthServive();
    const validateResult = authServive.validateToken(authToken ?? "--");

    if(!validateResult.success) 
        return res.status(validateResult.statusCode).json(validateResult);

    const user = await userDAO.getById(validateResult.data?.id ?? 0);
    if(!user) 
    {
        return res.status(500).json({ 
            success: false, 
            message: "Could not find logged user", 
            data: null
        });
    }

    res.locals.user = user;

    next();
}
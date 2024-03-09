import express from 'express'
import { ApiError, processAndRespond } from './_controller_utils';
import { userDAO } from '../daos/_setup';
import { randomUUID } from 'crypto';
import { authMiddleware } from './middlewares/auth_middleware';
import { UserSecureInfo } from '../models/user_secure_info';

const auth_controller = express.Router()
export default auth_controller;

auth_controller.post('/auth/login', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const { email, password } = req.body;

        if(!email)
            throw new ApiError(400, "'email' field is required");

        if(!password)
            throw new ApiError(400, "'password' field is required");

        const user = await userDAO.getByEmail(email);
        if(!user || user.password !== password)
            throw new ApiError(400, "Invalid user/password");

        user.token = randomUUID();
        await userDAO.update(user);

        return { 
            statusCode: 200, 
            success: true, 
            message: "Logged in", 
            data: new UserSecureInfo(
                user.id, 
                user.username, 
                user.email, 
                user.name, 
                user.token,
                user.pictureUrl
            )
        }
    });
})

auth_controller.post('/auth/logout', (req, res) => {
    processAndRespond(res, async () => 
    {
        const authToken = req.header(process.env.AUTH_TOKEN_NAME!);

        if(!authToken) 
            throw new ApiError(404, "Missing auth token");
    
        const user = await userDAO.getByToken(authToken);
        if(!user) 
            throw new ApiError(404, "User not logged");

        user.token = null;
        await userDAO.update(user);

        return { 
            statusCode: 200, 
            success: true, 
            message: "Logged out", 
            data: null
        }
    });
})

auth_controller.get('/auth/check', authMiddleware, (req, res) => {
    return res.status(200).json({});
})

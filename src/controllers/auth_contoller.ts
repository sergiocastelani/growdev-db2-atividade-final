import express from 'express'
import { ApiError, processAndRespond } from './util';
import { userDAO } from '../daos/_setup';
import { randomUUID } from 'crypto';

const AUTH_COOKIE_NAME = 'authorization';

const auth_controller = express.Router()
export default auth_controller;

auth_controller.post('/auth/login', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const { email, password } = req.body;

        //
        if(!email)
            throw new ApiError(400, "'email' field is required");

        if(!password)
            throw new ApiError(400, "'password' field is required");

        //
        const user = await userDAO.getByEmail(email);
        if(!user)
            throw new ApiError(404, "User not found");

        if(user.password !== password)
            throw new ApiError(401, "Invalid password");

        //
        user.token = randomUUID();
        await userDAO.update(user);

        //
        res.cookie(AUTH_COOKIE_NAME, user.token);

        return { 
            statusCode: 200, 
            success: true, 
            message: "Loggin successful", 
            data: {
                id: user.id, 
                email: user.email, 
                name: user.name,
            }
        }
    });
})

auth_controller.post('/auth/logout', (req, res) => {
    processAndRespond(res, async () => 
    {
        const { authorization } = req.cookies;

        if(!authorization) 
            throw new ApiError(404, "Missing auth token");
    
        const user = await userDAO.getByToken(authorization);
        if(!user) 
            throw new ApiError(404, "User not logged");

        user.token = null;
        await userDAO.update(user);

        res.clearCookie(AUTH_COOKIE_NAME);

        return { 
            statusCode: 200, 
            success: true, 
            message: "Logout successful", 
            data: null
        }
    });
})


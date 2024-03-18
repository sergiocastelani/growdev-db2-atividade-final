import express from 'express'
import { processAndRespond } from './controller_utils';
import { authMiddleware } from './middlewares/auth_middleware';
import { AuthService } from '../services/auth_service';

const auth_controller = express.Router()
export default auth_controller;

auth_controller.post('/auth/login', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const { email, password } = req.body;

        return await (new AuthService()).login(email, password);
    });
})

auth_controller.get('/auth/check', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logged user",
    });
})

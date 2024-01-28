import express from 'express'
import { ApiError, processAndRespond } from './_controller_utils';
import { likeDAO } from '../daos/_setup';
import { Like } from '../models/like';
import { authMiddleware } from './middlewares/auth_middleware';
import { User } from '../models/user';

const like_controller = express.Router()
export default like_controller;

like_controller.post('/like/:tweetId', authMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const user : User = res.locals.user;

        const likeData = await likeDAO.insert(new Like(parseInt(req.params.tweetId), user.id));

        return {
            statusCode: 201, 
            success: true, 
            message: "Tweet liked", 
            data: likeData
        };
    });
})

like_controller.delete('/like/:tweetId', authMiddleware, (req, res) => {
    processAndRespond(res, async () => 
    {
        const user : User = res.locals.user;

        const likeData = await likeDAO.deleteById(parseInt(req.params.tweetId), user.id);
        if (likeData === null)
            throw new ApiError(404, "Like data not found");

        return {
            statusCode: 200, 
            success: true, 
            message: "Tweet unliked", 
            data: likeData
        };
    });
})


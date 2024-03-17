import express from 'express'
import { processAndRespond } from './controller_utils';
import { authMiddleware } from './middlewares/auth_middleware';
import { User } from '../models/user';
import { LikeService } from '../services/like_service';

const like_controller = express.Router()
export default like_controller;

like_controller.post('/like/:tweetId', authMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const user : User = res.locals.user;

        const likeResult = await (new LikeService()).addNewLike(parseInt(req.params.tweetId), user.id);

        return likeResult;
    });
})

like_controller.delete('/like/:tweetId', authMiddleware, (req, res) => {
    processAndRespond(res, async () => 
    {
        const user : User = res.locals.user;

        const likeResult = await (new LikeService()).removeLike(parseInt(req.params.tweetId), user.id);

        return likeResult;
    });
})


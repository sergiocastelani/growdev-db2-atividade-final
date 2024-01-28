import express from 'express'
import { ApiError, processAndRespond } from './_controller_utils';
import { likeDAO } from '../daos/_setup';
import { ILike } from '../models/like';

const like_controller = express.Router()
export default like_controller;

like_controller.get('/like/:tweetId', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        throw new ApiError(501, "Not implemented");
    });
})

like_controller.post('/unlike/:tweetId', (req, res) => {
    processAndRespond(res, async () => 
    {
        throw new ApiError(501, "Not implemented");
    });
})


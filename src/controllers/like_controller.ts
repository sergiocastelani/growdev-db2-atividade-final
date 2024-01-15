import express from 'express'
import { ApiError, processAndRespond } from './util';
import { likeDAO } from '../daos/_setup';
import { ILike } from '../models/like';

const like_controller = express.Router()
export default like_controller;

like_controller.get('/like/:tweetId', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        
        return { 
            statusCode: 200, 
            success: true, 
            message: "Tweet found", 
            data: null
        }
    });
})

like_controller.post('/unlike/:tweetId', (req, res) => {
    processAndRespond(res, async () => 
    {
        return { 
            statusCode: 201, 
            success: true, 
            message: "Tweet created", 
            data: {}
        }
    });
})


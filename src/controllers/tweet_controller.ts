import express from 'express'
import { ApiError, processAndRespond } from './_controller_utils';
import { tweetDAO } from '../daos/_setup';
import { ITweet } from '../models/tweet';
import { authMiddleware } from '../auth/auth_middleware';

const tweet_controller = express.Router()
export default tweet_controller;

tweet_controller.get('/tweet/all', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10000);

        const tweets = await tweetDAO.getAll(page, limit)

        return { 
            statusCode: 200, 
            success: true, 
            message: "Found tweets", 
            data: tweets
        }
    });
})

tweet_controller.get('/tweet/:id', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet = await tweetDAO.getById(parseInt(req.params.id))

        if (tweet === null)
           throw new ApiError(404, "Tweet not found");

        return { 
            statusCode: 200, 
            success: true, 
            message: "Tweet found", 
            data: tweet
        }
    });
})

tweet_controller.post('/tweet', authMiddleware, (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet : ITweet = req.body;

        //validations
        if (!tweet.content)
            throw new ApiError(400, "'content' field must be informed");

        tweet.userId = req.app.locals.user.id;

        //
        const newTweet = await tweetDAO.insert(tweet);

        return { 
            statusCode: 201, 
            success: true, 
            message: "Tweet created", 
            data: newTweet
        }
    });
})

tweet_controller.put('/tweet/:id', (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const newData = req.body;
        newData.id = parseInt(req.params.id);
 
         //validations
        if (!newData.content)
            throw new ApiError(400, "'content' field must be informed");

        if (!newData.userId)
            throw new ApiError(400, "'userId' field must be informed");

        //
        const updatedTweet = await tweetDAO.update(newData);

        if (updatedTweet === null)
            throw new ApiError(404, "Tweet not found");
 
        return { 
            statusCode: 200,
            success: true,
            message: "Tweet updated",
            data: updatedTweet
        }
    });
})

tweet_controller.delete('/tweet/:id', (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet = await tweetDAO.deleteById(parseInt(req.params.id))

        if (tweet === null)
           throw new ApiError(404, "Tweet not found");

        return { 
            statusCode: 200, 
            success: true, 
            message: "Tweet deleted", 
            data: tweet
        }
    });
})


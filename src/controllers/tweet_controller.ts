import express from 'express'
import { ApiError, processAndRespond } from './controller_utils';
import { tweetDAO } from '../daos/_setup';
import { ITweet } from '../models/tweet';
import { authMiddleware } from './middlewares/auth_middleware';
import { loggedUserMiddleware } from './middlewares/logged_user_middleware';

const tweet_controller = express.Router()
export default tweet_controller;

tweet_controller.get('/tweet/all', loggedUserMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10000);
        const likedUserId = res.locals.user?.id;

        const tweets = await tweetDAO.getAllForDisplay(page, limit, likedUserId);

        return { 
            statusCode: 200, 
            success: true, 
            message: "Found tweets", 
            data: tweets
        }
    });
})

tweet_controller.get('/tweet/user/:userId', loggedUserMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10000);
        const likedUserId = res.locals.user?.id;
        const userIdFilter = parseInt(req.params.userId);

        const tweets = await tweetDAO.getAllForDisplay(page, limit, likedUserId, userIdFilter);

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

        tweet.userId = res.locals.user.id;

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

tweet_controller.post('/reply/:tweetId', authMiddleware, (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet : ITweet = req.body;

        //validations
        if (!tweet.content)
            throw new ApiError(400, "'content' field must be informed");

        const repliedTweet = await tweetDAO.getById(parseInt(req.params.tweetId));
        if (!repliedTweet)
            throw new ApiError(400, "The replied tweet doesn't exist");

        //
        tweet.userId = res.locals.user.id;
        tweet.repliedId = repliedTweet.id;

        const newTweet = await tweetDAO.insert(tweet);

        return { 
            statusCode: 201, 
            success: true, 
            message: "Tweet created", 
            data: newTweet
        }
    });
})

tweet_controller.get('/tweet/replies/:tweetId', loggedUserMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10000);
        const likedUserId = res.locals.user?.id;

        const tweets = await tweetDAO.getRepliesForDisplay(
            parseInt(req.params.tweetId), 
            page, 
            limit, 
            likedUserId
        );

        return { 
            statusCode: 200, 
            success: true, 
            message: "Found tweets",
            data: tweets
        }
    });
})

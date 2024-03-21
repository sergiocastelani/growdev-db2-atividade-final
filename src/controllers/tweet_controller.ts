import express from 'express'
import { processAndRespond } from './controller_utils';
import { ITweet } from '../models/tweet';
import { authMiddleware } from './middlewares/auth_middleware';
import { loggedUserMiddleware } from './middlewares/logged_user_middleware';
import { TweetService } from '../services/tweet_service';

const tweet_controller = express.Router()
export default tweet_controller;

tweet_controller.get('/tweet/all', loggedUserMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10000);
        const likedUserId = res.locals.user?.id;

        return await (new TweetService()).listPage(page, limit, likedUserId);
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

        return await (new TweetService()).listProfilePage(page, limit, likedUserId, userIdFilter);
    });
})

tweet_controller.get('/tweet/:id', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        return await (new TweetService()).getById(parseInt(req.params.id));
    });
})

tweet_controller.post('/tweet', authMiddleware, (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet : ITweet = req.body;
        tweet.userId = res.locals.user.id;

        return await (new TweetService()).create(tweet);
    });
})

tweet_controller.put('/tweet/:id', (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet : ITweet = req.body;
        tweet.userId = res.locals.user.id;
        tweet.id = parseInt(req.params.id);

        return await (new TweetService()).update(tweet);
    });
})

tweet_controller.delete('/tweet/:id', (req, res) => 
{
    processAndRespond(res, async () => 
    {
        return await (new TweetService()).delete(parseInt(req.params.id));
    });
})

tweet_controller.post('/reply/:tweetId', authMiddleware, (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const tweet : ITweet = req.body;
        tweet.userId = res.locals.user.id;
        tweet.repliedId = parseInt(req.params.tweetId);
        return await (new TweetService()).reply(tweet);
    });
})

tweet_controller.get('/tweet/replies/:tweetId', loggedUserMiddleware, async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10000);
        const likedUserId = res.locals.user?.id;
        const repliedTweetId = parseInt(req.params.tweetId);

        return await (new TweetService()).listReplyPage(
            repliedTweetId, 
            page, 
            limit, 
            likedUserId
        );
    });
})

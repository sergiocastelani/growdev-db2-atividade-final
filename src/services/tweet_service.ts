import { tweetDAO } from "../daos/_setup";
import { ITweet, Tweet } from "../models/tweet";
import { TweetDisplay } from "../models/tweet_display";
import { ApiError, ServiceResponseAsync, SuccessResult } from "./services_types";

export class TweetService 
{
    public async listPage(page: number, limit: number, likedUserId: number) 
    : ServiceResponseAsync<TweetDisplay[]>
    {
        const tweets = await tweetDAO.getAllForDisplay(page, limit, likedUserId);

        return SuccessResult("Found tweets", tweets);
    }

    public async listProfilePage(page: number, limit: number, likedUserId: number, userIdFilter: number) 
    : ServiceResponseAsync<TweetDisplay[]>
    {
        const tweets = await tweetDAO.getAllForDisplay(page, limit, likedUserId, userIdFilter);

        return SuccessResult("Found tweets", tweets);
    }

    public async listReplyPage(repliedTweetId: number, page: number, limit: number, likedUserId: number) 
    : ServiceResponseAsync<TweetDisplay[]>
    {
        const tweets = await tweetDAO.getRepliesForDisplay(
            repliedTweetId, 
            page, 
            limit, 
            likedUserId
        );

        return SuccessResult("Found tweets", tweets);
    }

    public async getById(tweetId: number) : ServiceResponseAsync<Tweet>
    {
        const tweet = await tweetDAO.getById(tweetId);

        if (!tweet)
           throw new ApiError(404, "Tweet not found");

        return SuccessResult("Tweet found", tweet);
    }

    public async create(tweet: ITweet) : ServiceResponseAsync<Tweet>
    {
        this.validateTweetFields(tweet);

        const newTweet = await tweetDAO.insert(tweet);
        return SuccessResult("Tweet created", newTweet, 201);
    }

    public async update(tweet: ITweet) : ServiceResponseAsync<Tweet>
    {
        this.validateTweetFields(tweet);

        const updatedTweet = await tweetDAO.update(tweet);

        if (updatedTweet === null)
            throw new ApiError(404, "Tweet not found");

        return SuccessResult("Tweet updated", updatedTweet);
    }

    public async delete(id: number) : ServiceResponseAsync<Tweet>
    {
        const tweet = await tweetDAO.deleteById(id);

        if (!tweet)
            throw new ApiError(404, "Tweet not found");

        return SuccessResult("Tweet deleted", tweet);
    }

    public async reply(tweet: ITweet) : ServiceResponseAsync<Tweet>
    {
        const repliedTweet = await tweetDAO.getById(tweet.repliedId ?? -1);
        if (!repliedTweet)
            throw new ApiError(400, "The replied tweet doesn't exist");

        return this.create(tweet);
    }

    public validateTweetFields(tweet: ITweet) 
    {
        if (!tweet.content)
            throw new ApiError(400, "'content' field must be informed");

        if (tweet.content.length < 3)
            throw new ApiError(400, "'content' must have 3 characters at least");

        if (tweet.content.length > 250)
            throw new ApiError(400, "'content' can have 250 characters at most");
 
        if (!tweet.userId)
            throw new ApiError(400, "'userId' field must be informed");
    }
}

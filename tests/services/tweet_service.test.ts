import { TweetService } from "../../src/services/tweet_service";
import { tweetDAO } from "../../src/daos/_setup";
import { TweetDisplay } from "../../src/models/tweet_display";
import { ITweet, Tweet } from "../../src/models/tweet";
import { UserDisplay } from "../../src/models/user_display";
import { ApiError } from "../../src/services/services_types";

jest.mock('../../src/daos/_setup');
const tweetDAOMock = tweetDAO as jest.Mocked<typeof tweetDAO>;

beforeEach(() => jest.resetAllMocks());

const createTweetDisplayObj = () : TweetDisplay => new TweetDisplay(
    /*id:*/ Math.trunc(Math.random() * 100),
    /*repliedId:*/ null,
    /*content:*/ "content",
    /*createdAt:*/ new Date(),
    /*totalReplies:*/ 0,
    /*totalLikes:*/ 5,
    /*user:*/ new UserDisplay(1, "username", "name", null),
    /*liked:*/ true
);

const createTweetObj = () : Tweet => new Tweet(
    /*id:*/ Math.trunc(Math.random() * 100),
    /*userId:*/ 1,
    /*repliedId:*/ null,
    /*content:*/ "content",
    /*createdAt:*/ new Date()
);

describe('Test for TweetService class', () => 
{
    test('listPage() must return some tweets', async () => 
    {
        const sut = new TweetService();
        const tweets = [ createTweetDisplayObj(), createTweetDisplayObj() ];
        tweetDAOMock.getAllForDisplay.mockResolvedValue(tweets);

        const result = await sut.listPage(0, 0, 0);

        expect(tweetDAOMock.getAllForDisplay).toHaveBeenCalled();
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('statusCode', 200);
        expect(result).toHaveProperty('message', "Found tweets");
        expect(result.data?.length).toBe(2);
        expect(result.data?.[0].id).toBe(tweets[0].id);
        expect(result.data?.[1].user.name).toBe("name");
    });

    test('listProfilePage() must return some tweets', async () => 
    {
        const sut = new TweetService();
        const tweets = [ createTweetDisplayObj(), createTweetDisplayObj() ];
        tweetDAOMock.getAllForDisplay.mockResolvedValue(tweets);

        const result = await sut.listProfilePage(0, 0, 0, 0);

        expect(tweetDAOMock.getAllForDisplay).toHaveBeenCalled();
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('statusCode', 200);
        expect(result).toHaveProperty('message', "Found tweets");
        expect(result.data?.length).toBe(2);
        expect(result.data?.[0].id).toBe(tweets[0].id);
        expect(result.data?.[1].user.name).toBe("name");
    });

    test('listReplyPage() must return some tweets', async () => 
    {
        const sut = new TweetService();
        const tweets = [ createTweetDisplayObj(), createTweetDisplayObj() ];
        tweetDAOMock.getRepliesForDisplay.mockResolvedValue(tweets);

        const result = await sut.listReplyPage(0, 0, 0, 0);

        expect(tweetDAOMock.getRepliesForDisplay).toHaveBeenCalled();
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('statusCode', 200);
        expect(result).toHaveProperty('message', "Found tweets");
        expect(result.data?.length).toBe(2);
        expect(result.data?.[0].id).toBe(tweets[0].id);
        expect(result.data?.[1].user.name).toBe("name");
    });

    test('getById() must throw exception when id does not exist', async () => 
    {
        const sut = new TweetService();
        const action = async () => await sut.getById(0);

        await expect(action()).rejects.toThrow(new ApiError(404, "Tweet not found"));
    });

    test('getById() must succeed', async () => 
    {
       const sut = new TweetService();
       const tweet = createTweetObj();
       tweetDAOMock.getById.mockResolvedValue(tweet);

       const result = await sut.getById(tweet.id);

       expect(tweetDAOMock.getById).toHaveBeenCalled();
       expect(result).toHaveProperty('success', true);
       expect(result).toHaveProperty('statusCode', 200);
       expect(result).toHaveProperty('message', "Tweet found");
       expect(result.data?.id).toBe(tweet.id);
    });

    test('create() must succeed', async () => 
    {
       const sut = new TweetService();
       const tweet = createTweetObj();
       tweetDAOMock.insert.mockResolvedValue(tweet);

       const result = await sut.create(tweet);

       expect(tweetDAOMock.insert).toHaveBeenCalled();
       expect(result).toHaveProperty('success', true);
       expect(result).toHaveProperty('statusCode', 201);
       expect(result).toHaveProperty('message', "Tweet created");
       expect(result.data?.id).toBe(tweet.id);
    });

    test('update() must succeed', async () => 
    {
       const sut = new TweetService();
       const tweet = createTweetObj();
       tweet.content = "content_updated";
       tweetDAOMock.update.mockResolvedValue(tweet);

       const result = await sut.update(tweet);

       expect(tweetDAOMock.update).toHaveBeenCalled();
       expect(result).toHaveProperty('success', true);
       expect(result).toHaveProperty('statusCode', 200);
       expect(result).toHaveProperty('message', "Tweet updated");
       expect(result.data?.content).toBe("content_updated");
    });

    test('update() must throw on inexistent tweet id', async () => 
    {
       const sut = new TweetService();
       const tweet = createTweetObj();
       tweetDAOMock.update.mockResolvedValue(null);

       const action = async () => await sut.update(tweet);

       await expect(action()).rejects.toThrow(new ApiError(404, "Tweet not found"));
    });

    test('delete() must succeed', async () => 
    {
       const sut = new TweetService();
       const tweet = createTweetObj();
       tweetDAOMock.deleteById.mockResolvedValue(tweet);

       const result = await sut.delete(tweet.id);

       expect(tweetDAOMock.deleteById).toHaveBeenCalled();
       expect(result).toHaveProperty('success', true);
       expect(result).toHaveProperty('statusCode', 200);
       expect(result).toHaveProperty('message', "Tweet deleted");
       expect(result.data?.id).toBe(tweet.id);
    });

    test('delete() must throw on inexistent tweet id', async () => 
    {
       const sut = new TweetService();
       tweetDAOMock.deleteById.mockResolvedValue(null);

       const action = async () => await sut.delete(1);

       await expect(action()).rejects.toThrow(new ApiError(404, "Tweet not found"));
    });

    test('reply() must succeed', async () => 
    {
       const sut = new TweetService();
       const tweet = createTweetObj();
       tweetDAOMock.getById.mockResolvedValue(tweet);
       tweetDAOMock.insert.mockResolvedValue(tweet);

       const result = await sut.reply(tweet);

       expect(tweetDAOMock.getById).toHaveBeenCalled();
       expect(tweetDAOMock.insert).toHaveBeenCalled();
       expect(result).toHaveProperty('success', true);
       expect(result).toHaveProperty('statusCode', 201);
       expect(result).toHaveProperty('message', "Tweet created");
       expect(result.data?.id).toBe(tweet.id);
    });

    test('reply() must throw on inexistent replied id', async () => 
    {
       const sut = new TweetService();
       tweetDAOMock.getById.mockResolvedValue(null);

       const action = async () => await sut.reply(createTweetObj());

       await expect(action()).rejects.toThrow(new ApiError(404, "The replied tweet doesn't exist"));
    });

    const validateTweetFieldsCases : [string, ITweet][] = [
        //[error message, ITweet]
        ["'content' field must be informed", {id: 1, userId: 1, repliedId: null, content: "", createdAt: new Date()}],
        ["'content' must have 3 characters at least", {id: 1, userId: 1, repliedId: null, content: "--", createdAt: new Date()}],
        ["'content' can have 250 characters at most", {id: 1, userId: 1, repliedId: null, content: "-".repeat(300), createdAt: new Date()}],
        ["'userId' field must be informed", {id: 1, userId: 0, repliedId: null, content: "content", createdAt: new Date()}],
    ];
    test.each(validateTweetFieldsCases)('validateTweetFields(): %s', async (errorMessage, tweet) => 
    {
        const sut = new TweetService();
        const action = () => sut.validateTweetFields(tweet);

        expect(action).toThrow(new ApiError(400, errorMessage));
    });
});
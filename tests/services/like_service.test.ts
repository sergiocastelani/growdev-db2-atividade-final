import { LikeService } from "../../src/services/like_service";
import { likeDAO } from "../../src/daos/_setup";

jest.mock('../../src/daos/_setup');
const likeDAOMock = likeDAO as jest.Mocked<typeof likeDAO>;

beforeEach(() => jest.resetAllMocks());

describe('Test for LikeService class', () => 
{
    test('addNewLike() must succeed', async () => 
    {
        const sut = new LikeService();
        likeDAOMock.insert.mockResolvedValue({
            tweetId: 888,
            userId: 999
        });

        const result = await sut.addNewLike(888, 999);

        expect(likeDAOMock.insert).toHaveBeenCalled();
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('statusCode', 201);
        expect(result).toHaveProperty('message', "Like created");
        expect(result.data?.tweetId).toBe(888);
        expect(result.data?.userId).toBe(999);
    });

    test('removeLike() must fail on inexistent like', async () => 
    {
        const sut = new LikeService();

        const result = await sut.removeLike(888, 999);

        expect(likeDAOMock.deleteById).toHaveBeenCalled();
        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('statusCode', 404);
        expect(result).toHaveProperty('message', "Like data not found");
    });

    test('removeLike() must succedd on existing like', async () => 
    {
        const sut = new LikeService();
        likeDAOMock.deleteById.mockResolvedValue({
            tweetId: 888,
            userId: 999
        });

        const result = await sut.removeLike(888, 999);

        expect(likeDAOMock.deleteById).toHaveBeenCalled();
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('statusCode', 200);
        expect(result).toHaveProperty('message', "Tweet unliked");
        expect(result.data?.tweetId).toBe(888);
        expect(result.data?.userId).toBe(999);
    });
});
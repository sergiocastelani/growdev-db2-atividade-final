import { likeDAO } from "../daos/_setup";
import { ILike, Like } from "../models/like";
import { ApiError, ServiceResponseAsync, SuccessResponse } from "./services_types";

export class LikeService 
{
    public async addNewLike(tweetId: number, userId: number) : ServiceResponseAsync<ILike>
    {
        const like = await likeDAO.insert(new Like(tweetId, userId));
        
        return { 
            success: true, 
            message: "Like added",
            statusCode: 200,
            data: like
        };
    }

    public async removeLike(tweetId: number, userId: number) : ServiceResponseAsync<ILike>
    {
        const likeData = await likeDAO.deleteById(tweetId, userId);
        if (likeData === null)
            throw new ApiError(404, "Like data not found");

        return SuccessResponse("Tweet unliked", likeData);
    }
}

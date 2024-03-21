import { likeDAO } from "../daos/_setup";
import { ILike, Like } from "../models/like";
import { ErrorResult, ServiceResponseAsync, SuccessResult } from "./services_types";

export class LikeService 
{
    public async addNewLike(tweetId: number, userId: number) : ServiceResponseAsync<ILike>
    {
        const like = await likeDAO.insert(new Like(tweetId, userId));
        
        return SuccessResult("Like created", like, 201);
    }

    public async removeLike(tweetId: number, userId: number) : ServiceResponseAsync<ILike>
    {
        const likeData = await likeDAO.deleteById(tweetId, userId);
        if (!likeData)
            return ErrorResult(404, "Like data not found");

        return SuccessResult("Tweet unliked", likeData);
    }
}

import { Like } from "../../models/like";
import { repository } from "./_setup";

export class LikeDAO_Prisma 
{
    async getById(tweetId: number, userId: number) : Promise<Like | null>
    {
        const dbData = await repository.like.findUnique({ where: { id: { tweetId, userId } } });

        if (dbData === null)
            return null;

        return new Like(dbData.tweetId, dbData.userId);
    }

    async insert(like: Like) : Promise<Like>
    {
        const dbData = await repository.like.create({data: like});
        return new Like(dbData.tweetId, dbData.userId);
    }

    async update(like: Like) : Promise<Like | null>
    {
        const {tweetId, userId} = like;
        let dbData = await repository.like.findUnique({where: {id: { tweetId, userId }}});
        if (dbData === null)
            return null;

        dbData = await repository.like.update({where: {id: { tweetId, userId }}, data: like})

        return new Like(dbData.tweetId, dbData.userId);
    }

    async deleteById(tweetId: number, userId: number) : Promise<Like | null>
    {
        const dbData = await repository.like.findUnique({where: {id: { tweetId, userId }}});
        if (dbData === null)
            return null;

        await repository.like.delete({where: {id: { tweetId, userId }}});

        return new Like(dbData.tweetId, dbData.userId);
    }
}
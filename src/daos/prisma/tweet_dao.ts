import { Tweet } from "../../models/tweet";
import { repository } from "./_setup";

export class TweetDAO_Prisma 
{
    async getAll(page: number, limit: number) : Promise<Tweet[]>
    {
        const dbData = await repository.tweet.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });

        return dbData.map((e) => new Tweet(e.id, e.userId, e.repliedId, e.content, e.createdAt));
    }

    async getById(id: number) : Promise<Tweet | null>
    {
        const dbData = await repository.tweet.findUnique({ where: { id } });

        if (dbData === null)
            return null;

        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content, dbData.createdAt);
    }

    async insert(tweet: Tweet) : Promise<Tweet>
    {
        tweet.createdAt = new Date();
        const dbData = await repository.tweet.create({data: tweet});
        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content, dbData.createdAt);
    }

    async update(tweet: Tweet) : Promise<Tweet | null>
    {
        let dbData = await repository.tweet.findUnique({where: {id: tweet.id}});
        if (dbData === null)
            return null;

        tweet.createdAt = dbData.createdAt;
        
        dbData = await repository.tweet.update({where: {id: tweet.id}, data: tweet})

        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content, dbData.createdAt);
    }

    async deleteById(id: number) : Promise<Tweet | null>
    {
        const dbData = await repository.tweet.findUnique({where: {id}});
        if (dbData === null)
            return null;

        await repository.tweet.delete({where: {id}});

        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content, dbData.createdAt);
    }
}
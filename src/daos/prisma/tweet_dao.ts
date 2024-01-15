import { Tweet } from "../../models/tweet";
import { repository } from "./_setup";

export class TweetDAO_Prisma 
{
    async getById(id: number) : Promise<Tweet | null>
    {
        const dbData = await repository.tweet.findUnique({ where: { id } });

        if (dbData === null)
            return null;

        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content);
    }

    async insert(tweet: Tweet) : Promise<Tweet>
    {
        const dbData = await repository.tweet.create({data: tweet});
        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content);
    }

    async update(tweet: Tweet) : Promise<Tweet | null>
    {
        let dbData = await repository.tweet.findUnique({where: {id: tweet.id}});
        if (dbData === null)
            return null;

        dbData = await repository.tweet.update({where: {id: tweet.id}, data: tweet})

        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content);
    }

    async deleteById(id: number) : Promise<Tweet | null>
    {
        const dbData = await repository.tweet.findUnique({where: {id}});
        if (dbData === null)
            return null;

        await repository.tweet.delete({where: {id}});

        return new Tweet(dbData.id, dbData.userId, dbData.repliedId, dbData.content);
    }
}
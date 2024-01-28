import { Tweet } from "../../models/tweet";
import { TweetDisplay } from "../../models/tweet_display";
import { UserDisplay } from "../../models/user_display";
import { repository } from "./_setup";

export class TweetDAO_Prisma 
{
    async getAllForDisplay(page: number, limit: number, userIdLiked?: Number) : Promise<TweetDisplay[]>
    {
        let likesFilter : any = false;
        if (userIdLiked)
        {
            likesFilter = {
                where: {
                    userId: userIdLiked,
                }
            };
        }

        const dbData = await repository.tweet.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select:{
                id: true, 
                repliedId: true, 
                content: true,
                createdAt: true,
                user: true,
                likes: likesFilter,
                _count: {
                    select: {
                        replies: true,
                        likes: true,
                    }
                }
            },
        });

        return dbData.map((e) => new TweetDisplay(
            e.id, 
            e.repliedId, 
            e.content, 
            e.createdAt,
            e._count.replies,
            e._count.likes,
            UserDisplay.FromUser(e.user),
            e.likes?.length > 0 ?? false,
        ));
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
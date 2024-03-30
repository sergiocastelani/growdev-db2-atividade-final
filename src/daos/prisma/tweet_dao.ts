import { Tweet } from "../../models/tweet";
import { TweetDisplay } from "../../models/tweet_display";
import { UserDisplay } from "../../models/user_display";
import repository from "./_setup";

export class TweetDAO_Prisma 
{
    async getAllForDisplay(
        page: number, 
        limit: number, 
        userIdLiked?: Number, 
        userIdFilter?: number
    ) 
    : Promise<TweetDisplay[]>
    {
        const where = {
            userId: userIdFilter,
        }

        const dbData = await _getForDisplay(page, limit, where, userIdLiked);

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

    async getRepliesForDisplay(
        tweetId: number,
        page: number, 
        limit: number, 
        userIdLiked?: Number
    ) 
    : Promise<TweetDisplay[]>
    {
        const repliedTweet = await _getForDisplay(1, 1, {id: tweetId}, userIdLiked);

        const where = {
            repliedId: tweetId,
        };
        const replies = await _getForDisplay(page, limit, where, userIdLiked);

        return repliedTweet
            .concat(replies)
            .map((e) => new TweetDisplay(
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
}

async function _getForDisplay(page: number, limit: number, whereFilter: object, userIdLiked?: Number)
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

    return await repository.tweet.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: 'desc',
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
        where: whereFilter,
    });
}
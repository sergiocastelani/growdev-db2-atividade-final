import { LikeDAO_Prisma } from "./prisma/like_dao";
import { TweetDAO_Prisma } from "./prisma/tweet_dao";
import { UserDAO_Prisma } from "./prisma/user_dao";

export const userDAO = new UserDAO_Prisma();
export const tweetDAO = new TweetDAO_Prisma();
export const likeDAO = new LikeDAO_Prisma();

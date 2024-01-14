import { Tweet } from "../../models/tweet";

export class TweetDAO_Prisma {
    getById(id: number) : Tweet {
        return new Tweet(0, 0, null);
    }
}
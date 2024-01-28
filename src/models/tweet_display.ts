import { UserDisplay } from "./user_display";

export class TweetDisplay {
    constructor(
        public id: number,
        public repliedId: number | null,
        public content: string,
        public createdAt: Date,
        public totalReplies: number,
        public totalLikes: number,
        public user: UserDisplay,
        public liked: boolean,
    )
    {}
}


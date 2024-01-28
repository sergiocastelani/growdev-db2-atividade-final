export interface ITweet 
{
    id: number;
    userId: number;
    repliedId: number | null;
    content: string;
    createdAt: Date;
}

export class Tweet implements ITweet {
    constructor(
        public id: number,
        public userId: number,
        public repliedId: number | null,
        public content: string,
        public createdAt: Date
    )
    {}
}


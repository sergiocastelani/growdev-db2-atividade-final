export interface ITweet 
{
    id: number;
    userId: number;
    repliedId: number | null;
}

export class Tweet implements ITweet {
    constructor(
        public id: number,
        public userId: number,
        public repliedId: number | null,
    )
    {}
}


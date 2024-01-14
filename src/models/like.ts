export interface ILike
{
    tweetId: number;
    userId: number;
}

export class Like implements ILike {
    constructor(
        public tweetId: number,
        public userId: number,
    )
    {}
}


export interface IUserSecureInfo 
{
    id: number;
    username: string;
    email: string;
    name: string;
    pictureUrl: string | null;
}

export class UserSecureInfo implements IUserSecureInfo {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public name: string,
        public pictureUrl: string | null,
    )
    {}
}


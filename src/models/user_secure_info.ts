export interface IUserSecureInfo 
{
    id: number;
    username: string;
    email: string;
    name: string;
    token: string | null;
    pictureUrl: string | null;
}

export class UserSecureInfo implements IUserSecureInfo {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public name: string,
        public token: string | null,
        public pictureUrl: string | null,
    )
    {}
}


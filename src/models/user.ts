export interface IUser 
{
    id: number;
    username: string;
    email: string;
    name: string;
    password: string;
    token: string | null;
    pictureUrl: string | null;
}

export class User implements IUser {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public name: string,
        public password: string,
        public token: string | null,
        public pictureUrl: string | null,
    )
    {}
}


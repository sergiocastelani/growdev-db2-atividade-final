export interface IUser 
{
    id: number;
    email: string;
    name: string;
    password: string;
    token: string | null;
}

export class User implements IUser {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public password: string,
        public token: string | null,
    )
    {}
}


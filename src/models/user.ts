export interface IUser 
{
    id: number;
    email: string;
    name: string;
}

export class User implements IUser {
    constructor(
        public id: number,
        public email: string,
        public name: string,
    )
    {}
}


export interface IUserAuthInfo 
{
    id: number;
    email: string;
    name: string;
    token: string;
}

export class UserAuthInfo implements IUserAuthInfo {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public token: string,
    )
    {}
}


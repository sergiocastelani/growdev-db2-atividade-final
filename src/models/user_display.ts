import { User } from "./user";

export class UserDisplay 
{
    constructor(
        public id: number,
        public username: string,
        public name: string,
        public pictureUrl: string | null,
    )
    {}

    static FromUser(user: User)
    {
        return new UserDisplay(user.id, user.username, user.name, user.pictureUrl);
    }
}


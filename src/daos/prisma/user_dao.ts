import { User } from "../../models/user";
import { repository } from "./_setup";

export class UserDAO_Prisma 
{
    async getById(id: number) : Promise<User | null>
    {
        const userDb = await repository.user.findUnique({ where: { id } });

        if (userDb === null)
            return null;

        return new User(
            userDb.id, 
            userDb.username, 
            userDb.email, 
            userDb.name, 
            userDb.password, 
            userDb.token,
            userDb.pictureUrl
        );
    }

    async insert(user: User) : Promise<User>
    {
        const userDb = await repository.user.create({data: user});
        return new User(
            userDb.id, 
            userDb.username, 
            userDb.email, 
            userDb.name, 
            userDb.password, 
            userDb.token,
            userDb.pictureUrl
        );
    }

    async update(user: User) : Promise<User | null>
    {
        let userDb = await repository.user.findUnique({where: {id: user.id}});
        if (userDb === null)
            return null;

        userDb = await repository.user.update({where: {id: user.id}, data: user})

        return new User(
            userDb.id, 
            userDb.username, 
            userDb.email, 
            userDb.name, 
            userDb.password, 
            userDb.token,
            userDb.pictureUrl
        );
    }

    async deleteById(id: number) : Promise<User | null>
    {
        const userDb = await repository.user.findUnique({where: {id}});
        if (userDb === null)
            return null;

        await repository.user.delete({where: {id}});

        return new User(
            userDb.id, 
            userDb.username, 
            userDb.email, 
            userDb.name, 
            userDb.password, 
            userDb.token,
            userDb.pictureUrl
        );
    }

    async getByEmail(email: string) : Promise<User | null> {
        const userDb = await repository.user.findUnique({where: {email}});
        if (userDb === null)
            return null;

         return new User(
            userDb.id, 
            userDb.username, 
            userDb.email, 
            userDb.name, 
            userDb.password, 
            userDb.token,
            userDb.pictureUrl
        );
   }

    async getByToken(token: string) : Promise<User | null> {
        const userDb = await repository.user.findFirst({where: {token}});
        if (userDb === null)
            return null;

        return new User(
            userDb.id, 
            userDb.username, 
            userDb.email, 
            userDb.name, 
            userDb.password, 
            userDb.token,
            userDb.pictureUrl
        );
    }
}
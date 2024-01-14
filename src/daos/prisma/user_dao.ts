import { 
    PrismaClient, 
    User as UserPrisma 
} from "@prisma/client";
import { User } from "../../models/user";

export class UserDAO_Prisma 
{
    async getById(repository: PrismaClient, id: number) : Promise<User | null>
    {
        const userDb = await repository.user.findUnique({ where: { id } });

        if (userDb === null)
            return null;

        return new User(userDb.id, userDb.email, userDb.name);
    }

    async insertUser(repository: PrismaClient, user: User) : Promise<User>
    {
        const userDb = await repository.user.create({data: user});
        return new User(userDb.id, userDb.email, userDb.name);
    }

    async updateUser(repository: PrismaClient, user: User) : Promise<User | null>
    {
        let userDb = await repository.user.findUnique({where: {id: user.id}});
        if (userDb === null)
            return null;

        userDb = await repository.user.update({where: {id: user.id}, data: userDb})

        return new User(userDb.id, userDb.email, userDb.name);
    }

    async deleteById(repository: PrismaClient, id: number) : Promise<User | null>
    {
        const userDb = await repository.user.findUnique({where: {id}});
        if (userDb === null)
            return null;

        await repository.user.delete({where: {id}});

        return new User(userDb.id, userDb.email, userDb.name);
    }

}
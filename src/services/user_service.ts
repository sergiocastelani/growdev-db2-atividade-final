import { userDAO } from "../daos/_setup";
import { IUser } from "../models/user";
import { ServiceResponseAsync } from "./services_types";

export class UserService 
{
    public async getById(id: number) : ServiceResponseAsync<IUser>
    {
        const user = await userDAO.getById(id);
        if(!user) 
        {
            return { 
                success: false, 
                message: "Could not find logged user",
                statusCode: 404
            };
        }

        return { 
            success: true, 
            message: "User found",
            statusCode:200,
            data: user
        };
    }
}

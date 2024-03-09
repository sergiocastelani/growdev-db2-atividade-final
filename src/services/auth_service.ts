import { ApiError } from "../controllers/controller_utils";
import { userDAO } from "../daos/_setup";
import { IUserSecureInfo, UserSecureInfo } from "../models/user_secure_info";
import { ServiceResponse, ServiceResponseAsync } from "./services_types";
import jwt from "jsonwebtoken";

export class AuthServive 
{
    public async login(email: string, password: string) : ServiceResponseAsync<string>
    {
        if(!email)
            throw new ApiError(400, "'email' field is required");

        if(!password)
            throw new ApiError(400, "'password' field is required");

        const user = await userDAO.getByEmail(email);
        if(!user || user.password !== password)
            throw new ApiError(400, "Invalid user/password");

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            pictureUrl: user.pictureUrl
        } as IUserSecureInfo, process.env.JWT_PASSWORD!, { expiresIn: "1d" });

        return { 
            statusCode: 200, 
            success: true, 
            message: "Logged in", 
            data: token
        }
    }

    public validateToken(authToken: string) : ServiceResponse<IUserSecureInfo>
    {
        if(!authToken) 
        {
            return {
                success: false, 
                message: "Unauthorized",
                statusCode: 401,
            }
        }

        try
        {
            const payload = jwt.verify(authToken, process.env.JWT_PASSWORD!) as IUserSecureInfo;
            return {
                success: true, 
                message: "Authorized",
                statusCode: 200,
                data: payload
            }
        }
        catch(e)
        {
            return {
                success: false, 
                message: "Unauthorized",
                statusCode: 401,
            }
        }
    }

    public decodeToken(authToken: string) : IUserSecureInfo | null
    {
        return jwt.decode(authToken) as (IUserSecureInfo | null);
    }
}

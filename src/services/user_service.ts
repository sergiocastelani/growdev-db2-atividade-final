import { userDAO } from "../daos/_setup";
import { UserUpdateRequest } from "../models/requests/user_update_request";
import { IUser, User } from "../models/user";
import { ApiError, ErrorResult, ServiceResponseAsync, SuccessResult } from "./services_types";

export class UserService 
{
    public async getById(id: number) : ServiceResponseAsync<IUser>
    {
        const user = await userDAO.getById(id);
        if(!user) 
            return ErrorResult(404, "User not found");

        return SuccessResult("User found", user);
    }

    public async create(user: IUser) : ServiceResponseAsync<IUser>
    {
        const validationResult = await this.validateNewUser(user);
        if (! validationResult.success)
            return validationResult;

        const newUser = await userDAO.insert(user);

        return SuccessResult("User created", newUser);
    }

    public async update(user: IUser, updateRequest: UserUpdateRequest) : ServiceResponseAsync<IUser>
    {
        const validationResult = await this.validateUpdateRequest(user, updateRequest);
        if (! validationResult.success)
            return validationResult;

        const newUser = new User(
            user.id, 
            updateRequest.username, 
            updateRequest.email, 
            updateRequest.name, 
            updateRequest.newPassword ?? user.password, 
            updateRequest.pictureUrl ?? null
        );
            
        const updatedUser = await userDAO.update(newUser);

        if (updatedUser === null)
            throw new ApiError(404, "User not found");

        return SuccessResult("User updated", updatedUser);
    }

    public async validateNewUser(user: IUser) : ServiceResponseAsync<IUser>
    {
        if (!user.username)
            return ErrorResult(400, "'username' field must be informed");

        if (!user.email)
            return ErrorResult(400, "'email' field must be informed");

        if (!user.name)
            return ErrorResult(400, "'name' field must be informed");

        if (!user.password)
            return ErrorResult(400, "'password' field must be informed");

        const existingUserEmail = await userDAO.getByEmail(user.email);
        if(existingUserEmail)
            return ErrorResult(400, "This email is already being used");

        const existingUsername = await userDAO.getByUsername(user.username);
        if(existingUsername)
            return ErrorResult(400, "This username is already being used");

        return SuccessResult("Valid user");
    }

    public async validateUpdateRequest(user: IUser, updateRequest: UserUpdateRequest) : ServiceResponseAsync<IUser>
    {
        if (!updateRequest.username)
            return ErrorResult(400, "'username' field must be informed");

        if (!updateRequest.email)
            return ErrorResult(400, "'email' field must be informed");

        if (!updateRequest.name)
            return ErrorResult(400, "'name' field must be informed");

        if (!updateRequest.currentPassword)
            return ErrorResult(400, "'Current password' field must be informed");

        if (updateRequest.currentPassword !== user.password)
            return ErrorResult(400, "Wrong password");

        if (updateRequest.newPassword !== undefined && updateRequest.newPassword.length < 4)
            return ErrorResult(400, "Password must have 4 characters at least");

        const existingUserEmail = await userDAO.getByEmail(updateRequest.email);
        if(existingUserEmail && existingUserEmail.id != user.id)
            return ErrorResult(400, "This email is already being used");

        const existingUsername = await userDAO.getByUsername(updateRequest.username);
        if(existingUsername && existingUsername.id != user.id)
            return ErrorResult(400, "This username is already being used");

        return SuccessResult("Valid request");
    }
}

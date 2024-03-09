import express from 'express'
import { ApiError, processAndRespond } from './controller_utils';
import { userDAO } from '../daos/_setup';
import { IUser, User } from '../models/user';
import { UserSecureInfo } from '../models/user_secure_info';
import { randomUUID } from 'crypto';
import { UserUpdateRequest } from '../models/requests/user_update_request';
import { authMiddleware } from './middlewares/auth_middleware';

const user_controller = express.Router()
export default user_controller;

user_controller.get('/user/:id', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const user = await userDAO.getById(parseInt(req.params.id))

        if (user === null)
           throw new ApiError(404, "User not found");

        return { 
            statusCode: 200, 
            success: true, 
            message: "User found", 
            data: user
        }
    });
})

user_controller.post('/user', (req, res) => {
    processAndRespond(res, async () => 
    {
        const user : IUser = req.body;

        //validations
        if (!user.username)
            throw new ApiError(400, "'username' field must be informed");

        if (!user.email)
            throw new ApiError(400, "'email' field must be informed");

        if (!user.name)
            throw new ApiError(400, "'name' field must be informed");

        if (!user.password)
            throw new ApiError(400, "'password' field must be informed");

        const existingUserEmail = await userDAO.getByEmail(user.email);
        if(existingUserEmail)
            throw new ApiError(400, "This email is already being used");

        const existingUsername = await userDAO.getByUsername(user.username);
        if(existingUsername)
            throw new ApiError(400, "This username is already being used");

        //
        const newUser = await userDAO.insert(user);

        return { 
            statusCode: 201, 
            success: true, 
            message: "User created", 
            data: new UserSecureInfo(
                newUser.id,
                newUser.username,
                newUser.email,
                newUser.name,
                newUser.pictureUrl
            )
        }
    });
})

user_controller.put('/user', authMiddleware, (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const newUserData : UserUpdateRequest = req.body;
        const user = res.locals.user;
 
        //validations
        if (!newUserData.username)
            throw new ApiError(400, "'username' field must be informed");

        if (!newUserData.email)
            throw new ApiError(400, "'email' field must be informed");

        if (!newUserData.name)
            throw new ApiError(400, "'name' field must be informed");

        if (!newUserData.currentPassword)
            throw new ApiError(400, "'Current password' field must be informed");

        if (newUserData.currentPassword !== user.password)
            throw new ApiError(400, "Wrong password");

        if (newUserData.newPassword !== undefined && newUserData.newPassword.length < 4)
            throw new ApiError(400, "Password must have 4 characters at least");

        const existingUserEmail = await userDAO.getByEmail(newUserData.email);
        if(existingUserEmail && existingUserEmail.id != user.id)
            throw new ApiError(400, "This email is already being used");

        const existingUsername = await userDAO.getByUsername(newUserData.username);
        if(existingUsername && existingUsername.id != user.id)
            throw new ApiError(400, "This username is already being used");

        //
        const newUser = new User(
            user.id, 
            newUserData.username, 
            newUserData.email, 
            newUserData.name, 
            newUserData.newPassword ?? user.password, 
            newUserData.pictureUrl ?? null
        );
            
        const updatedUser = await userDAO.update(newUser);

        if (updatedUser === null)
            throw new ApiError(404, "User not found");
 
        return { 
            statusCode: 200,
            success: true,
            message: "User updated",
            data: new UserSecureInfo(
                updatedUser.id,
                updatedUser.username,
                updatedUser.email,
                updatedUser.name,
                updatedUser.pictureUrl
            )
        }
    });
})

/*
user_controller.delete('/user/:id', (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const user = await userDAO.deleteById(parseInt(req.params.id))

        if (user === null)
           throw new ApiError(404, "User not found");

        return { 
            statusCode: 200, 
            success: true, 
            message: "User deleted", 
            data: user
        }
    });
})
*/


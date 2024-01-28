import express from 'express'
import { ApiError, processAndRespond } from './_controller_utils';
import { userDAO } from '../daos/_setup';
import { IUser } from '../models/user';
import { UserSecureInfo } from '../models/user_secure_info';

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
                newUser.token,
                newUser.pictureUrl
            )
        }
    });
})

user_controller.put('/user/:id', (req, res) => {
    processAndRespond(res, async () => 
    {
        const newUserData = req.body;
        newUserData.id = parseInt(req.params.id);
 
        //
        const updatedUser = await userDAO.update(newUserData);

        if (updatedUser === null)
            throw new ApiError(404, "User not found");
 
        return { 
            statusCode: 200,
            success: true,
            message: "User updated",
            data: updatedUser
        }
    });
})

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


import express from 'express'
import { ApiError, processAndRespond } from './util';
import { userDAO } from '../daos/config';
import { IUser } from '../models/user';

const user_controller = express.Router()
export default user_controller;

user_controller.get('/user/:id', async (req, res) => 
{
    processAndRespond(res, async () => 
    {
        const user = await userDAO.getById(req.app.locals.repository, parseInt(req.params.id))

        if (user === null) {
           throw new ApiError(404, "User not found")
        }

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
        if (!user.email)
            throw new ApiError(400, "'email' field must be informed")

        if (!user.name)
            throw new ApiError(400, "'name' field must be informed")

        //
        const newUser = await userDAO.insertUser(req.app.locals.repository, user);

        return { 
            statusCode: 201, 
            success: true, 
            message: "User created", 
            data: newUser
        }
    });
})

user_controller.put('/user/:id', (req, res) => {
    processAndRespond(res, async () => 
    {
        const newUserData = req.body;
        newUserData.id = parseInt(req.params.id);
        const updatedUser = await userDAO.updateUser(req.app.locals.repository, newUserData);

        if (updatedUser === null) {
            throw new ApiError(404, "User not found")
        }
 
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
        const user = await userDAO.deleteById(req.app.locals.repository, parseInt(req.params.id))

        if (user === null) {
           throw new ApiError(404, "User not found")
        }

        return { 
            statusCode: 200, 
            success: true, 
            message: "User deleted", 
            data: user
        }
    });
})


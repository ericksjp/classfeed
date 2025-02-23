import {Router} from 'express'
import { addUser, deleteUserById, getUsers, getUserById } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUsers)
userRoutes.post('/', addUser)
userRoutes.get('/:id', getUserById)
userRoutes.delete('/:id', deleteUserById)

export default userRoutes;

import {Router} from 'express'
import { deleteUserById, getUsers, getUserById } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUserById)
userRoutes.delete('/:id', deleteUserById)

export default userRoutes;

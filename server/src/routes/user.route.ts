import {Router} from 'express'
import { deleteUserById, getUsers, getUserById, updateUser } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUserById)
userRoutes.delete('/:id', deleteUserById)
userRoutes.patch('/:id', updateUser)

export default userRoutes;

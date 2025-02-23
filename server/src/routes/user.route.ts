import {Router} from 'express'
import { addUser, getUsers, getUserSingleById } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUsers)
userRoutes.post('/', addUser)
userRoutes.get('/:id', getUserSingleById)

export default userRoutes;

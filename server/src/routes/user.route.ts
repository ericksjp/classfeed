import {Router} from 'express'
import { addUser, getUsers } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/', getUsers)
userRoutes.post('/', addUser)

export default userRoutes;

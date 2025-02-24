import {Router} from 'express'
import { deleteUserById, getUsers, getUserById, updateUser } from '../controllers/user.controller';
import auth from "../middlewares/auth"

const userRoutes = Router();

userRoutes.get('/', auth,  getUsers)
userRoutes.get('/:id',auth, getUserById)
userRoutes.delete('/:id', auth, deleteUserById)
userRoutes.patch('/:id', auth, updateUser)
export default userRoutes;

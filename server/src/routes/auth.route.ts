import {Router} from 'express'
import { login, signup } from '../controllers/auth.controller';

const authRoute = Router();

authRoute.post('/login', login)
authRoute.post('/signup', signup)

export default authRoute;

import {Router} from 'express'
import AuthController from '../controllers/auth.controller';

const authRoute = Router();

authRoute.post('/login', AuthController.login)
authRoute.post('/signup', AuthController.signup)

export default authRoute;

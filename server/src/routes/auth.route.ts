import {Router} from 'express'
import AuthController from '../controllers/auth.controller';
import Auth from '../middlewares/auth';
import {tryCatch} from "../utils/"

const authRoute = Router();

authRoute.post('/login', tryCatch(AuthController.login))
authRoute.post('/signup', tryCatch(AuthController.signup))
authRoute.get('/refresh', tryCatch(Auth, AuthController.refresh))

export default authRoute;

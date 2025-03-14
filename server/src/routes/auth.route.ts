import {Router} from 'express'
import AuthController from '../controllers/auth.controller';
import Auth from '../middlewares/auth';
import {catchError} from "../utils/"

const authRoute = Router();

authRoute.post('/login', catchError(AuthController.login))
authRoute.post('/signup', catchError(AuthController.signup))
authRoute.get('/refresh', catchError(Auth, AuthController.refresh))

export default authRoute;

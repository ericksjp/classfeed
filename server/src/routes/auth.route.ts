import {Router} from 'express'
import AuthController from '../controllers/auth.controller';
import Auth from '../middlewares/auth';

const authRoute = Router();

authRoute.post('/login', AuthController.login)
authRoute.post('/signup', AuthController.signup)
authRoute.get('/refresh', Auth, AuthController.refresh)

export default authRoute;

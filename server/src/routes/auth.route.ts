import {Router} from 'express'
import AuthController from '../controllers/auth.controller';
import Auth from '../middlewares/auth';
import {tryCatchWrapper, multiTryCatchWrapper} from "../utils/"

const authRoute = Router();

authRoute.post('/login', tryCatchWrapper(AuthController.login))
authRoute.post('/signup', tryCatchWrapper(AuthController.signup))
authRoute.get('/refresh', multiTryCatchWrapper([Auth, AuthController.refresh]))

export default authRoute;

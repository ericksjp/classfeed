import {Router} from 'express'
import AuthController from '../controllers/auth.controller';
import { authEmail, authId } from "../middlewares/auth";
import {tryCatch} from "../utils/"

const authRoute = Router();

authRoute.post('/login', tryCatch(AuthController.login))
authRoute.post('/signup', tryCatch(AuthController.saveUserWithOtp))
authRoute.post('/confirmotp', tryCatch(authEmail, AuthController.persistUser))
authRoute.get('/refresh', tryCatch(authId, AuthController.refresh))

export default authRoute;

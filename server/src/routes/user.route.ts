import { Router } from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middlewares/auth";
import { multiTryCatchWrapper } from "../utils";

const userRoutes = Router();

userRoutes.get("/", multiTryCatchWrapper([Auth, UserController.get]));
userRoutes.delete("/", multiTryCatchWrapper([Auth, UserController.remove]));
userRoutes.patch("/", multiTryCatchWrapper([Auth, UserController.update]));

export default userRoutes;

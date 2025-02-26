import { Router } from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middlewares/auth";

const userRoutes = Router();

userRoutes.get("/", Auth, UserController.get);
userRoutes.delete("/", Auth, UserController.remove);
userRoutes.patch("/", Auth, UserController.update);

export default userRoutes;

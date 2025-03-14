import { Router } from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middlewares/auth";
import { catchError } from "../utils";
import upload from "../config/upload";

const userRoutes = Router();

userRoutes.get("/", catchError(Auth, UserController.get));
userRoutes.delete("/", catchError(Auth, UserController.remove));
userRoutes.patch("/", catchError(Auth, UserController.update));
userRoutes.patch("/profilePicture", catchError(upload.single("image"), Auth, UserController.updateProfilePicture));
userRoutes.get("/profilePicture", catchError(Auth, UserController.getProfilePicture));
userRoutes.delete("/profilePicture", catchError(Auth, UserController.deleteProfilePicture));

export default userRoutes;

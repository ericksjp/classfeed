import { Router } from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middlewares/auth";
import { tryCatch } from "../utils";
import upload from "../config/upload";

const userRoutes = Router();

userRoutes.get("/", tryCatch(Auth, UserController.get));
userRoutes.delete("/", tryCatch(Auth, UserController.remove));
userRoutes.patch("/", tryCatch(Auth, UserController.update));
userRoutes.patch("/profilePicture", tryCatch(upload.single("image"), Auth, UserController.updateProfilePicture));
userRoutes.get("/profilePicture", tryCatch(Auth, UserController.getProfilePicture));
userRoutes.delete("/profilePicture", tryCatch(Auth, UserController.deleteProfilePicture));

export default userRoutes;

import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authId } from "../middlewares/auth";
import { tryCatch } from "../utils";
import upload from "../config/upload";

const userRoutes = Router();

userRoutes.get("/", tryCatch(authId, UserController.get));
userRoutes.delete("/", tryCatch(authId, UserController.remove));
userRoutes.patch("/", tryCatch(authId, UserController.update));
userRoutes.patch("/updatePassword", tryCatch(authId, UserController.updatePassword));
userRoutes.patch("/profilePicture", tryCatch(upload.single("image"), authId, UserController.updateProfilePicture));
userRoutes.get("/profilePicture", tryCatch(authId, UserController.getProfilePicture));
userRoutes.delete("/profilePicture", tryCatch(authId, UserController.deleteProfilePicture));

export default userRoutes;

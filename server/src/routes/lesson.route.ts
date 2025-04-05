import {Router} from "express";
import * as lessonController from "../controllers/lesson.controller";
import {isUserPartOfClass, isUserTeacher} from "../middlewares/verify"
import { tryCatch } from "../utils";
import Auth from "../middlewares/auth";

const lessonRoutes = Router({ mergeParams: true});

lessonRoutes.post("/", tryCatch(Auth, isUserTeacher, lessonController.createLesson))
lessonRoutes.get("/", tryCatch(Auth, isUserPartOfClass, lessonController.getlessons));
lessonRoutes.get("/:lessonId", tryCatch(Auth, isUserPartOfClass, lessonController.getLessonById))
lessonRoutes.patch("/:lessonId", tryCatch(Auth, isUserTeacher, lessonController.updateLesson))
lessonRoutes.delete("/:lessonId",tryCatch(Auth, isUserTeacher, lessonController.deleteLesson))

export default lessonRoutes;

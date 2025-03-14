import {Router} from "express";
import * as lessonController from "../controllers/lesson.controller";
import {isUserPartOfClass, isUserTeacher} from "../middlewares/verify"
import { catchError } from "../utils";
import Auth from "../middlewares/auth";

const lessonRoutes = Router({ mergeParams: true});

lessonRoutes.post("/", catchError(Auth, isUserTeacher, lessonController.createLesson))
lessonRoutes.get("/", catchError(Auth, isUserPartOfClass, lessonController.getlessons));
lessonRoutes.get("/:lessonId", catchError(Auth, isUserPartOfClass, lessonController.getLessonById))
lessonRoutes.patch("/:lessonId", catchError(Auth, isUserTeacher, lessonController.updateLesson))
lessonRoutes.delete("/:lessonId",catchError(Auth, isUserTeacher, lessonController.deleteLesson))

export default lessonRoutes;

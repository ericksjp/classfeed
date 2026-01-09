import { Router } from "express";
import * as lessonController from "../controllers/lesson.controller";
import { isUserPartOfClass, isUserTeacher } from "../middlewares/verify";
import { tryCatch } from "../utils";
import { authId } from "../middlewares/auth";

const lessonRoutes = Router({ mergeParams: true });

lessonRoutes.post("/", tryCatch(authId, isUserTeacher, lessonController.createLesson));
lessonRoutes.get("/", tryCatch(authId, isUserPartOfClass, lessonController.getlessons));
lessonRoutes.get("/:lessonId", tryCatch(authId, isUserPartOfClass, lessonController.getLessonById));
lessonRoutes.patch("/:lessonId", tryCatch(authId, isUserTeacher, lessonController.updateLesson));
lessonRoutes.delete("/:lessonId", tryCatch(authId, isUserTeacher, lessonController.deleteLesson));

export default lessonRoutes;

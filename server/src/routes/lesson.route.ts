import {Router} from "express";
import * as lessonController from "../controllers/lesson.controller";
import {isUserPartOfClass, isUserTeacher} from "../middlewares/verify"

const lessonRoutes = Router({ mergeParams: true});

lessonRoutes.get("/",isUserPartOfClass, lessonController.getlessons);
lessonRoutes.get("/:lessonId", isUserPartOfClass, lessonController.getLessonById);
lessonRoutes.post("/", isUserTeacher, lessonController.createLesson);
lessonRoutes.patch("/:lessonId", isUserTeacher, lessonController.updateLesson);
lessonRoutes.delete("/:lessonId",isUserTeacher, lessonController.deleteLesson);


export default lessonRoutes;

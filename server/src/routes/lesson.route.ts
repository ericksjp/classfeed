import {Router} from "express";
import * as lessonController from "../controllers/lesson.controller";
import {verifyUserClass} from "../middlewares/verify"

const lessonRoutes = Router();

lessonRoutes.get("/",verifyUserClass, lessonController.getlessons);
lessonRoutes.get("/:lessonId", verifyUserClass, lessonController.getLessonById);
lessonRoutes.post("/", lessonController.createLesson);
lessonRoutes.patch("/:lessonId", verifyUserClass, lessonController.updateLesson);
lessonRoutes.delete("/:lessonId",verifyUserClass, lessonController.deleteLesson);


export default lessonRoutes;
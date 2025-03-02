import {Router} from "express";
import * as lessonController from "../controllers/lesson.controller";
import {isUserPartOfClass, isUserTeacher} from "../middlewares/verify"
import { multiTryCatchWrapper } from "../utils";
import Auth from "../middlewares/auth";

const lessonRoutes = Router({ mergeParams: true});

lessonRoutes.post("/", multiTryCatchWrapper([Auth, isUserTeacher, lessonController.createLesson]))
lessonRoutes.get("/", multiTryCatchWrapper([Auth, isUserPartOfClass, lessonController.getlessons]));
lessonRoutes.get("/:lessonId", multiTryCatchWrapper([Auth, isUserPartOfClass, lessonController.getLessonById]))
lessonRoutes.patch("/:lessonId", multiTryCatchWrapper([Auth, isUserTeacher, lessonController.updateLesson]))
lessonRoutes.delete("/:lessonId",multiTryCatchWrapper([Auth, isUserTeacher, lessonController.deleteLesson]))

export default lessonRoutes;

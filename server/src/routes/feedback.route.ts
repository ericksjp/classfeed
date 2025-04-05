import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";
import {isUserPartOfClass, isUserStudent, isUserTeacher} from "../middlewares/verify";
import Auth from "../middlewares/auth";
import {tryCatch} from "../utils"

const feedbackRoutes = Router({ mergeParams: true});

feedbackRoutes.get("/", tryCatch(Auth, isUserTeacher, FeedbackController.getFeedbacks));
feedbackRoutes.get("/:feedbackId", tryCatch(Auth, isUserPartOfClass, FeedbackController.getFeedbackById));
feedbackRoutes.post("/", tryCatch(Auth, isUserStudent, FeedbackController.createFeedback));
feedbackRoutes.delete("/:feedbackId", tryCatch(Auth, isUserTeacher, FeedbackController.deleteFeedback));

export default feedbackRoutes;

import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";
import {isUserPartOfClass, isUserStudent, isUserTeacher} from "../middlewares/verify";
import { authId } from "../middlewares/auth";
import {tryCatch} from "../utils"

const feedbackRoutes = Router({ mergeParams: true});

feedbackRoutes.get("/", tryCatch(authId, isUserTeacher, FeedbackController.getFeedbacks));
feedbackRoutes.get("/:feedbackId", tryCatch(authId, isUserPartOfClass, FeedbackController.getFeedbackById));
feedbackRoutes.post("/", tryCatch(authId, isUserStudent, FeedbackController.createFeedback));
feedbackRoutes.delete("/:feedbackId", tryCatch(authId, isUserTeacher, FeedbackController.deleteFeedback));

export default feedbackRoutes;

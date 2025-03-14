import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";
import {isUserPartOfClass, isUserStudent, isUserTeacher} from "../middlewares/verify";
import Auth from "../middlewares/auth";
import {catchError} from "../utils"

const feedbackRoutes = Router({ mergeParams: true});

feedbackRoutes.get("/", catchError(Auth, isUserTeacher, FeedbackController.getFeedbacks));
feedbackRoutes.get("/:feedbackId", catchError(Auth, isUserPartOfClass, FeedbackController.getFeedbackById));
feedbackRoutes.post("/", catchError(Auth, isUserStudent, FeedbackController.createFeedback));
feedbackRoutes.delete("/:feedbackId", catchError(Auth, isUserTeacher, FeedbackController.deleteFeedback));

export default feedbackRoutes;

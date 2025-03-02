import { Router } from "express";
import FeedbackController from "../controllers/feedback.controller";
import {isUserPartOfClass, isUserStudent, isUserTeacher} from "../middlewares/verify";
import Auth from "../middlewares/auth";
import {multiTryCatchWrapper} from "../utils"

const feedbackRoutes = Router({ mergeParams: true});

feedbackRoutes.get("/", multiTryCatchWrapper([Auth, isUserTeacher, FeedbackController.getFeedbacks]));
feedbackRoutes.get("/:feedbackId", multiTryCatchWrapper([Auth, isUserPartOfClass, FeedbackController.getFeedbackById]));
feedbackRoutes.post("/", multiTryCatchWrapper([Auth, isUserStudent, FeedbackController.createFeedback]));
feedbackRoutes.delete("/:feedbackId", multiTryCatchWrapper([Auth, isUserTeacher, FeedbackController.deleteFeedback]));

export default feedbackRoutes;

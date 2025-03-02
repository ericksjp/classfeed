import { Router } from "express";
import * as feedbackController from "../controllers/feedback.controller";
import {isUserStudent, isUserTeacher} from "../middlewares/verify";

const feedbackRoutes = Router({ mergeParams: true});

feedbackRoutes.get("/", isUserTeacher, feedbackController.getFeedbacks);
feedbackRoutes.get("/:feedbackId", isUserTeacher, feedbackController.getFeedbackById);
feedbackRoutes.post("/", isUserStudent, feedbackController.createFeedback);
feedbackRoutes.delete("/:feedbackId", isUserTeacher, feedbackController.deleteFeedback);

export default feedbackRoutes;

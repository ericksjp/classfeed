import { Router } from "express";
import * as feedbackController from "../controllers/feedback.controller";
import {verifyUserClass} from "../middlewares/verify";

const feedbackRoutes = Router({ mergeParams: true});

feedbackRoutes.get("/",verifyUserClass, feedbackController.getFeedbacks);
feedbackRoutes.get("/:feedbackId", verifyUserClass, feedbackController.getFeedbackById);

export default feedbackRoutes;
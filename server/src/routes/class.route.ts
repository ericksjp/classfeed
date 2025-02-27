import { Router } from "express";

import { createClass, deleteClass, getClassById, getClasses, updateClass, updateClassStatus } from "../controllers/class.controller";
import auth from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
import feedbackRoutes from "./feedback.route";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:classId", auth, getClassById);
classRoutes.put("/:classId", auth, updateClass);
classRoutes.patch("/:classId", auth, updateClassStatus);
classRoutes.delete("/:classId", auth, deleteClass);
classRoutes.use("/:classId/lesson",auth, lessonRoutes);
classRoutes.use("/:classId/lesson/:lessonId", auth, feedbackRoutes);

export default classRoutes;

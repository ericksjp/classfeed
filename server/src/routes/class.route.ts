import { Router } from "express";

import { addStudent, createClass, deleteClass, getClassById, getClasses, getStudent, getStudents, removeStudent, updateClass, updateClassStatus } from "../controllers/class.controller";
import auth from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
import feedbackRoutes from "./feedback.route";
import { verifyUserClass } from "../middlewares/verify";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:classId", auth, getClassById);
classRoutes.put("/:classId", auth, updateClass);
classRoutes.patch("/:classId", auth, updateClassStatus);
classRoutes.delete("/:classId", auth, deleteClass);

// Route for student exit the class
classRoutes.delete("/:classId/drop", auth, removeStudent)

// Routes for teacher actions related to students in a class
classRoutes.get("/:classId/student", auth, verifyUserClass, getStudents)
classRoutes.get("/:classId/student/:studentId", auth, verifyUserClass, getStudent)
classRoutes.post("/:classId/student", auth, verifyUserClass, addStudent)
classRoutes.delete("/:classId/student/:studentId", auth, verifyUserClass, removeStudent)

classRoutes.use("/:classId/lesson",auth, lessonRoutes);
classRoutes.use("/:classId/lesson/:lessonId/feedback", auth, feedbackRoutes);

export default classRoutes;

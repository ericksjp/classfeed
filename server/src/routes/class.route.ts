import { Router } from "express";

import { addStudent, createClass, deleteClass, getClassById, getClasses, getStudent, getStudents, removeStudent, updateClass, updateClassStatus } from "../controllers/class.controller";
import auth from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
import feedbackRoutes from "./feedback.route";
import { isUserPartOfClass, isUserStudent, isUserTeacher } from "../middlewares/verify";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:classId", auth, isUserPartOfClass, getClassById);
classRoutes.put("/:classId", auth, isUserTeacher, updateClass);
classRoutes.patch("/:classId", auth, isUserTeacher, updateClassStatus);
classRoutes.delete("/:classId", auth, isUserTeacher, deleteClass);

// Route for student exit the class
classRoutes.delete("/:classId/drop", auth, isUserStudent, removeStudent)

// Routes for teacher actions related to students in a class
classRoutes.get("/:classId/student", auth, isUserTeacher, getStudents)
classRoutes.get("/:classId/student/:studentId", auth, isUserTeacher, getStudent)
classRoutes.post("/:classId/student", auth, isUserTeacher, addStudent)
classRoutes.delete("/:classId/student/:studentId", auth, isUserTeacher, removeStudent)

classRoutes.use("/:classId/lesson",auth, lessonRoutes);

classRoutes.use("/:classId/lesson/:lessonId/feedback", auth, feedbackRoutes);

export default classRoutes;

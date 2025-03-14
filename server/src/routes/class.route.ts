import { Router } from "express";

import { addStudent, createClass, deleteClass, getClassById, getClasses, getStudent, getStudents, removeStudent, updateClass } from "../controllers/class.controller";
import Auth from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
import feedbackRoutes from "./feedback.route";
import { isUserPartOfClass, isUserStudent, isUserTeacher } from "../middlewares/verify";
import { catchError } from "../utils";

const classRoutes = Router();

classRoutes.post("/", catchError(Auth, createClass));
classRoutes.get("/", catchError(Auth, getClasses));
classRoutes.get("/:classId", catchError(Auth, isUserPartOfClass, getClassById));
classRoutes.patch("/:classId", catchError(Auth, isUserTeacher, updateClass));
classRoutes.delete("/:classId", catchError(Auth, isUserTeacher, deleteClass));

// Route for student exit the class
classRoutes.delete("/:classId/drop", catchError(Auth, isUserStudent, removeStudent))

// Routes for teacher actions related to students in a class
classRoutes.get("/:classId/student", catchError(Auth, isUserPartOfClass, getStudents))
classRoutes.get("/:classId/student/:studentId", catchError(Auth, isUserTeacher, getStudent))
classRoutes.post("/:classId/student", catchError(Auth, isUserTeacher, addStudent))
classRoutes.delete("/:classId/student/:studentId", catchError(Auth, isUserTeacher, removeStudent))

// nested routes
classRoutes.use("/:classId/lesson", lessonRoutes);

classRoutes.use("/:classId/lesson/:lessonId/feedback", feedbackRoutes);

export default classRoutes;

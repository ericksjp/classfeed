import { Router } from "express";

import { addStudent, createClass, deleteClass, getClassById, getClasses, getStudent, getStudents, removeStudent, updateClass } from "../controllers/class.controller";
import Auth from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
import feedbackRoutes from "./feedback.route";
import { isUserPartOfClass, isUserStudent, isUserTeacher } from "../middlewares/verify";
import { tryCatch } from "../utils";

const classRoutes = Router();

classRoutes.post("/", tryCatch(Auth, createClass));
classRoutes.get("/", tryCatch(Auth, getClasses));
classRoutes.get("/:classId", tryCatch(Auth, isUserPartOfClass, getClassById));
classRoutes.patch("/:classId", tryCatch(Auth, isUserTeacher, updateClass));
classRoutes.delete("/:classId", tryCatch(Auth, isUserTeacher, deleteClass));

// Route for student exit the class
classRoutes.delete("/:classId/drop", tryCatch(Auth, isUserStudent, removeStudent))

// Routes for teacher actions related to students in a class
classRoutes.get("/:classId/student", tryCatch(Auth, isUserPartOfClass, getStudents))
classRoutes.get("/:classId/student/:studentId", tryCatch(Auth, isUserTeacher, getStudent))
classRoutes.post("/:classId/student", tryCatch(Auth, isUserTeacher, addStudent))
classRoutes.delete("/:classId/student/:studentId", tryCatch(Auth, isUserTeacher, removeStudent))

// nested routes
classRoutes.use("/:classId/lesson", lessonRoutes);

classRoutes.use("/:classId/lesson/:lessonId/feedback", feedbackRoutes);

export default classRoutes;

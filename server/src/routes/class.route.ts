import { Router } from "express";

import { addStudent, createClass, deleteClass, getClassById, getClasses, getStudent, getStudents, removeStudent, updateClass } from "../controllers/class.controller";
import { authId } from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
import feedbackRoutes from "./feedback.route";
import { isUserPartOfClass, isUserStudent, isUserTeacher } from "../middlewares/verify";
import { tryCatch } from "../utils";

const classRoutes = Router();

classRoutes.post("/", tryCatch(authId, createClass));
classRoutes.get("/", tryCatch(authId, getClasses));
classRoutes.get("/:classId", tryCatch(authId, isUserPartOfClass, getClassById));
classRoutes.patch("/:classId", tryCatch(authId, isUserTeacher, updateClass));
classRoutes.delete("/:classId", tryCatch(authId, isUserTeacher, deleteClass));

// Route for student exit the class
classRoutes.delete("/:classId/drop", tryCatch(authId, isUserStudent, removeStudent))

// Routes for teacher actions related to students in a class
classRoutes.get("/:classId/student", tryCatch(authId, isUserPartOfClass, getStudents))
classRoutes.get("/:classId/student/:studentId", tryCatch(authId, isUserTeacher, getStudent))
classRoutes.post("/:classId/student", tryCatch(authId, isUserTeacher, addStudent))
classRoutes.delete("/:classId/student/:studentId", tryCatch(authId, isUserTeacher, removeStudent))

// nested routes
classRoutes.use("/:classId/lesson", lessonRoutes);

classRoutes.use("/:classId/lesson/:lessonId/feedback", feedbackRoutes);

export default classRoutes;

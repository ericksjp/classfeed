import { Router } from "express";

import { addStudent, createClass, deleteClass, getClassById, getClasses, getStudent, getStudents, removeStudent, updateClass, updateClassStatus } from "../controllers/class.controller";
import Auth from "../middlewares/auth";
import lessonRoutes from "./lesson.route";
// import feedbackRoutes from "./feedback.route";
import { isUserPartOfClass, isUserStudent, isUserTeacher } from "../middlewares/verify";
import { multiTryCatchWrapper } from "../utils";

const classRoutes = Router();

classRoutes.post("/", multiTryCatchWrapper([Auth, createClass]));
classRoutes.get("/", multiTryCatchWrapper([Auth, getClasses]));
classRoutes.get("/:classId", multiTryCatchWrapper([Auth, isUserPartOfClass, getClassById]));
classRoutes.patch("/:classId", multiTryCatchWrapper([Auth, isUserTeacher, updateClass]));
classRoutes.patch("/:classId", multiTryCatchWrapper([Auth, isUserTeacher, updateClassStatus]));
classRoutes.delete("/:classId", multiTryCatchWrapper([Auth, isUserTeacher, deleteClass]));

// Route for student exit the class
classRoutes.delete("/:classId/drop", multiTryCatchWrapper([Auth, isUserStudent, removeStudent]))

// Routes for teacher actions related to students in a class
classRoutes.get("/:classId/student", multiTryCatchWrapper([Auth, isUserPartOfClass, getStudents]))
classRoutes.get("/:classId/student/:studentId", multiTryCatchWrapper([Auth, isUserTeacher, getStudent]))
classRoutes.post("/:classId/student", multiTryCatchWrapper([Auth, isUserTeacher, addStudent]))
classRoutes.delete("/:classId/student/:studentId", multiTryCatchWrapper([Auth, isUserTeacher, removeStudent]))

// nested routes
classRoutes.use("/:classId/lesson", lessonRoutes);

// classRoutes.use("/:classId/lesson/:lessonId/feedback", feedbackRoutes);

export default classRoutes;

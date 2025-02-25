import { Router } from "express";

import { createClass, deleteClass, getClassById, getClasses, updateClass, updateClassStatus } from "../controllers/class.controller";
import auth from "../middlewares/auth";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:classId", auth, getClassById);
classRoutes.put("/:classId", auth, updateClass);
classRoutes.patch("/:classId", auth, updateClassStatus);
classRoutes.delete("/:classId", auth, deleteClass);

export default classRoutes;

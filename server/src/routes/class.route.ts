import { Router } from "express";

import { createClass, getClassById, getClasses } from "../controllers/class.controller";
import auth from "../middlewares/auth";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:classId", auth, getClassById);

export default classRoutes;
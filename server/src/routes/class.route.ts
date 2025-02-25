import { Router } from "express";

import { createClass, getClassById, getClasses, updateClass } from "../controllers/class.controller";
import auth from "../middlewares/auth";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:id", auth, getClassById);
classRoutes.put("/:id", auth, updateClass);

export default classRoutes;
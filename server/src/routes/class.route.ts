import { Router } from "express";

import { createClass, getClassById, getClasses, updateClass, updateClassStatus } from "../controllers/class.controller";
import auth from "../middlewares/auth";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);
classRoutes.get("/", auth, getClasses);
classRoutes.get("/:id", auth, getClassById);
classRoutes.put("/:id", auth, updateClass);
classRoutes.patch("/:id", auth, updateClassStatus);

export default classRoutes;
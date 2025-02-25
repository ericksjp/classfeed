import { Router } from "express";

import { createClass } from "../controllers/class.controller";
import auth from "../middlewares/auth";

const classRoutes = Router();

classRoutes.post("/", auth, createClass);

export default classRoutes;
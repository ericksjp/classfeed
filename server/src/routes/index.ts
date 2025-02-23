import { Router } from "express";
import userRoutes from "./user.route";
const rootRouter:Router = Router();

rootRouter.use("/user", userRoutes);

export default rootRouter;

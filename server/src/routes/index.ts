import { Router } from "express";
import userRoutes from "./user.route";
import authRoute from "./auth.route";
import classRoutes from "./class.route";

const rootRouter:Router = Router();

rootRouter.use("/user", userRoutes);
rootRouter.use("/auth", authRoute);
rootRouter.use("/class", classRoutes);

export default rootRouter;

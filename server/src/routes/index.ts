import { Router } from "express";
import userRoutes from "./user.route";
import authRoute from "./auto.route";
const rootRouter:Router = Router();

rootRouter.use("/user", userRoutes);
rootRouter.use("/auth", authRoute);

export default rootRouter;

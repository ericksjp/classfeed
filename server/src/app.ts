import express from "express";
import rootRouter from "./routes";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import { FILE_STORAGE_PATH } from "./config/config";
import corsOptions from "./config/cors";

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", rootRouter);

app.use("/uploads", express.static(FILE_STORAGE_PATH));

app.use(errorHandler);

export default app;

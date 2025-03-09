import express from "express"
import rootRouter from "./routes";
import errorHandler from "./middlewares/errorHandler";
import path from "path";

const app = express();
app.use(express.json())

app.use('/api', rootRouter);

app.use('/uploads', express.static(path.resolve("uploads")));

app.use(errorHandler);

export default app

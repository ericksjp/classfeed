import express from "express"
import rootRouter from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json())

app.use('/api', rootRouter);

app.use('/uploads', express.static(process.env.FILE_STORAGE_PATH as string));

app.use(errorHandler);

export default app

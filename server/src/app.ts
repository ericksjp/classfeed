import express from "express"
import rootRouter from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json())

app.use('/api', rootRouter)

app.use(errorHandler);

export default app

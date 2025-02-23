import express from "express"
import rootRouter from "./routes";
import notFoundError from "./middlewares/not-found-error";

const app = express();
app.use(express.json())

app.use('/api', rootRouter)

app.use(notFoundError);

export default app

import express, {Request, Response} from "express"

const app = express();

app.get("/", (_: Request, res: Response) => {
  res.send({message: "hello world"})
})

export default app

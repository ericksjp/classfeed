import app from "./app";

console.log(process.env.SERVER_PORT)

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${process.env.SERVER_PORT}`)
})

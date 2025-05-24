import express from "express"
import helmet from "helmet"
import config from "./configs/config"
// import morgan from "./configs/morgan"
import eventEmitter from "./utils/logging"

const app = express()
const port = config.port|| 5002

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({extended: true}))


app.listen(port, async () => {
	eventEmitter.emit("logging", `Server is up and running on port: ${port}`)
})

export default app

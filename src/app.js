import express, { urlencoded, json } from "express";
import { AuthRouter } from "./routes/auth.route.js";
import { MessageRouter } from './routes/message.route.js'
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import "dotenv/config"

const app = express();
const options = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true
}
app.use(cors(options))
app.use(json());
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/message", MessageRouter);

// Error handler
app.use(errorHandler);

export { app };
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Import routes
import userRouter from "./routes/user.routes.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

//Route Declaration
app.use("/api/v1/users", userRouter);

//http://localhost:8000/api/v1/users

export { app }
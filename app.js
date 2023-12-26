import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./Routes/userRoutes.js";
import erroMiddleware from "./Middleware/errorMiddleware.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

//Routes
app.use("/ping", (req, res) => {
  res.send("pong");
});

//project_routes

app.use("/api/v1/user", userRouter);

//Invalid Routes

app.all("*", (req, res) => {
  res.status(404).send("OOPS !! 404 page not found");
});

app.use(erroMiddleware);

export default app;

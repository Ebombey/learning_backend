import express from "express";
import cors from "cors";
import healthCheckRouter from "./routes/healthCheck.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
healthCheckRouter;

// Using routers
app.use("/api/v1/healthCheck", healthCheckRouter);

export { app };

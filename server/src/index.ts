import { Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/db.ts";
import userRoutes from "./routes/userRoutes.ts";
import taskRoutes from "./routes/taskRoutes.ts";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const app = express();
const PORT = process.env.PORT!;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL (Vite default)
    credentials: true, // allows sending cookies
  })
);
app.use(cookieParser());

app.get("/health-check", (_, res: Response) => {
  res.status(200).send("Server is live");
});

app.use("/api", userRoutes);
app.use("/api", taskRoutes);

db().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/health-check`);
  });
});

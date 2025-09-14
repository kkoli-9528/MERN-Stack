import { Router } from "express";
import taskContoller from "../controllers/taskContoller";
import auth from "../middleware/auth";

const { create, read, update, remove } = taskContoller;

const taskRoutes = Router();

taskRoutes.post("/task", auth, create);
taskRoutes.get("/task/:id", auth, read);
taskRoutes.put("/task/:id", auth, update);
taskRoutes.delete("/task/:id", auth, remove);

export default taskRoutes;

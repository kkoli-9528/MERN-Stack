import { Router } from "express";
import taskContoller from "../controllers/taskContoller";
import auth from "../middleware/auth";
import ownershipCheck from "../middleware/ownershipCheck";

const { create, read, update, remove } = taskContoller;

const taskRoutes = Router();

taskRoutes.post("/task", auth, ownershipCheck, create);
taskRoutes.get("/task", auth, ownershipCheck, read);
taskRoutes.put("/task/:id", auth, ownershipCheck, update);
taskRoutes.delete("/task/:id", auth, ownershipCheck, remove);

export default taskRoutes;

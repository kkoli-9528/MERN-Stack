import { Router } from "express";
import userContoller from "../controllers/userContoller";

const { register, login } = userContoller;

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);

export default userRoutes;

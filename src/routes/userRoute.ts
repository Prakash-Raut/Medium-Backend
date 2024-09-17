import { Hono } from "hono";
import {
	getCurrentUser,
	loginUser,
	registerUser,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const userRoute = new Hono()
	.post("/register", registerUser)
	.post("/login", loginUser)
	.get("/get-current-user",authMiddleware, getCurrentUser);

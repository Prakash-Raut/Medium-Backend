import { Hono } from "hono";
import {
	createBlog,
	getAllBlogs,
	getBlog,
	updateBlog,
} from "../controllers/blogController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const blogRoute = new Hono()
	.use("/", authMiddleware)
	.post("/create", createBlog)
	.get("/get-all", getAllBlogs)
	.get("/:id", getBlog)
	.put("/:id", updateBlog);

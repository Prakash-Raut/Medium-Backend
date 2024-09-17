import { Hono } from "hono";
import { blogRoute } from "./blogRoute";
import { userRoute } from "./userRoute";

export const v1Route = new Hono()
	.route("/users", userRoute)
	.route("/blogs", blogRoute);

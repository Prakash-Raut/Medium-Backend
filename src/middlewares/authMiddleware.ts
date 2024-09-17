import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
	const jwt = c.req.header("Authorization");
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(" ")[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set("jwtPayload", payload.id);
	await next();
};

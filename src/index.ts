import { Hono } from "hono";
import { logger } from "hono/logger";
import { v1Route } from "./routes";

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	};
}>();

app.use(logger());

app.get("/", (c) => {
	return c.text("ok");
});

app.route("/api/v1/", v1Route);

export default app;

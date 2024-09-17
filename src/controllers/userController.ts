import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { ApiResponse } from "../utils/ApiResponse";
import { signinSchema } from "../validations/signinSchema";
import { signupSchema } from "../validations/signupSchema";

const registerUser = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const body = await c.req.json();
	try {
		const result = signupSchema.safeParse(body);

		if (!result.success) {
			c.status(400);
			return c.json({ error: result.error });
		}

		const { email, password, name } = result.data;

		console.log(email, password, name);
		
		const existedUser = await db.user.findUnique({
			where: {
				email,
			},
		});

		if (existedUser) {
			c.status(403);
			return c.json({ error: "user already exists" });
		}

		console.log("existed user", existedUser);

		const user = await db.user.create({
			data: {
				email,
				password,
				name,
			},
		});

		if (!user) {
			c.status(403);
			return c.json({ error: "error while signing up" });
		}

		console.log("user", user);

		return c.json(
			new ApiResponse(201, { user }, "User created successfully")
		);
	} catch (e) {
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

const loginUser = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const body = await c.req.json();
	try {
		const result = signinSchema.safeParse(body);

		if (!result.success) {
			c.status(400);
			return c.json({ error: result.error });
		}

		const { email } = result.data;

		const user = await db.user.findUnique({
			where: {
				email,
			},
			cacheStrategy: {
				ttl: 60,
			},
		});

		if (!user) {
			c.status(403);
			return c.json({ error: "user not found" });
		}

		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

		return c.json(
			new ApiResponse(200, { user, jwt }, "User logged in successfully")
		);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

const getCurrentUser = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const userId = c.get("jwtPayload");
	try {
		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) {
			c.status(403);
			return c.json({ error: "user not found" });
		}

		return c.json({ user });
	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

export { getCurrentUser, loginUser, registerUser };

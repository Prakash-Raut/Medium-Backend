import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { ApiResponse } from "../utils/ApiResponse";
import { blogSchema } from "../validations/blogSchema";

export const createBlog = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const body = await c.req.json();
	const userId = c.get("jwtPayload");
	console.log(userId);
	try {
		const result = blogSchema.safeParse(body);

		if (!result.success) {
			c.status(400);
			return c.json({ error: result.error });
		}

		const { title, content } = result.data;

		const post = await db.post.create({
			data: {
				title,
				content,
				author: {
					connect: {
						id: userId,
					},
				},
			},
		});
		return c.json(
			new ApiResponse(201, { post }, "Post created successfully")
		);
	} catch (error) {
		console.error(error);
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

export const getAllBlogs = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try {
		const posts = await db.post.findMany({});

		if (!posts) {
			c.status(404);
			return c.json({ error: "No posts found" });
		}

		return c.json(
			new ApiResponse(200, { posts }, "Posts fetched successfully")
		);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

export const getBlog = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const id = c.req.param("id");

	try {
		const post = await db.post.findUnique({
			where: {
				id,
			},
		});

		if (!post) {
			c.status(404);
			return c.json({ error: "Post not found" });
		}

		return c.json(
			new ApiResponse(200, { post }, "Post fetched successfully ")
		);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

export const updateBlog = async (c: Context) => {
	const db = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const userId = c.get("userId");
	const body = await c.req.json();

	try {
		const result = blogSchema.safeParse(body);

		if (!result.success) {
			c.status(400);
			return c.json({ error: result.error });
		}

		const { title, content } = result.data;

		db.post.update({
			where: {
				id: body.id,
				authorId: userId,
			},
			data: {
				title,
				content,
			},
		});
	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
};

import { z } from "zod";

const emailValidation = z.string().email();

const passwordValidation = z.string().min(6);

const nameValidation = z.string().min(2);

export const signupSchema = z.object({
	email: emailValidation,
	password: passwordValidation,
	name: nameValidation,
});

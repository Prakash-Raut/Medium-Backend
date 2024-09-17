import { z } from "zod";

const emailValidation = z.string().email();

const passwordValidation = z.string().min(6);

export const signinSchema = z.object({
	email: emailValidation,
	password: passwordValidation,
});

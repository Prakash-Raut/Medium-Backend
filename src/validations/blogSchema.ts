import {z} from "zod";

const titleValidation = z.string().min(2);
const contentValidation = z.string().min(2);

export const blogSchema = z.object({
    title: titleValidation,
    content: contentValidation,
});
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, { message: "Your username need to be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Your password need to be at least 6 characters long" }),
});

export const ProfileSchema = z.object({
  avatar: z.string(),
  email: z.string(),
  id: z.string(),
  username: z.string(),
});

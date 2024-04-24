import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 chars")
    .max(20, "Username length should not exceed 20")
    .regex(/^[a-zA-Z0-9_]+$/, 'Username should not contain special characters');

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"enter a valid email"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})
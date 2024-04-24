import {z} from 'zod'

export const messageSchema = z.object({
    content: z
    .string()
    .min(5, "message must be at least 5 characters")
    .max(300, "Message should not be more than 300 characters")  
})
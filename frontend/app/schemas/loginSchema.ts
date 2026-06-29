import z from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid Email"),
    password: z.string().min(4,"Password must be 4 charcters"),
    role: z.enum(["Admin", "Teacher", "Student"])
})

export type LoginForm = z.infer<typeof loginSchema>
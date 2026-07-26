import z from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().min(3, "name is required"),
  schoolName: z.string().min(3, "school name is required"),
  email: z.email("email is required"),
  password: z.string().min(4, "password must be atleast 4 characters"),
});

export type AdminRegisterForm = z.infer<typeof adminRegisterSchema>;

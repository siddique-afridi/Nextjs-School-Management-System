import z from "zod";

const baseSchema = z.object({
  role: z.enum(["Admin", "Teacher", "Student"]),
  password: z.string().min(4, "Password must be at least 4 characters"),
  email: z.string().optional(),
  rollNum: z.string().optional(),
  studentName: z.string().optional(),
});

export const loginSchema = baseSchema.superRefine((data, ctx) => {
  if (data.role === "Student") {
    if (!data.rollNum?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Roll number is required",
        path: ["rollNum"],
      });
    }
    if (!data.studentName?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Student name is required",
        path: ["studentName"],
      });
    }
    return;
  }

  if (!data.email?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Email is required",
      path: ["email"],
    });
    return;
  }

  const emailResult = z.email("Invalid email").safeParse(data.email);
  if (!emailResult.success) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid email",
      path: ["email"],
    });
  }
});

export type LoginForm = z.infer<typeof loginSchema>;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/constants";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm, loginSchema } from "../schemas/loginSchema";
import { getDashboardPath, useAuth } from "../context/userContext";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setApiError("");

    try {
      const user = await login({
        role: data.role as UserRole,
        email: data.email,
        password: data.password,
        rollNum: data.rollNum,
        studentName: data.studentName,
      });

      router.push(getDashboardPath(user.role));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Something went wrong";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              School Management
            </h1>
            <p className="mt-2 text-muted-foreground">
              Select your role to continue
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSelectedRole(UserRole.ADMIN);
                setValue("role", "Admin");
              }}
              className="w-full rounded-lg border-2 border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="font-semibold text-foreground">Admin</div>
              <div className="text-sm text-muted-foreground">
                Manage school, classes, and users
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedRole(UserRole.TEACHER);
                setValue("role", "Teacher");
              }}
              className="w-full rounded-lg border-2 border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="font-semibold text-foreground">Teacher</div>
              <div className="text-sm text-muted-foreground">
                Manage classes and attendance
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedRole(UserRole.STUDENT);
                setValue("role", "Student");
              }}
              className="w-full rounded-lg border-2 border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="font-semibold text-foreground">Student</div>
              <div className="text-sm text-muted-foreground">
                View attendance and results
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isStudent = selectedRole === UserRole.STUDENT;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {selectedRole === UserRole.ADMIN && "Admin Login"}
            {selectedRole === UserRole.TEACHER && "Teacher Login"}
            {selectedRole === UserRole.STUDENT && "Student Login"}
          </h1>
          <button
            onClick={() => {
              setSelectedRole(null);
              setApiError("");
            }}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Back to role selection
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("role")} />

          {isStudent ? (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Roll Number
                </label>
                <input
                  type="number"
                  {...register("rollNum")}
                  placeholder="e.g. 101"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.rollNum && (
                  <p className="text-red-500 text-sm">{errors.rollNum.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  {...register("studentName")}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.studentName && (
                  <p className="text-red-500 text-sm">
                    {errors.studentName.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder={
                  selectedRole === UserRole.ADMIN
                    ? "admin@school.com"
                    : "teacher@school.com"
                }
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {apiError && <p className="text-red-500">{apiError}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {selectedRole === UserRole.ADMIN && (
          <div className="flex justify-center items-center p-2 mt-2 gap-2">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-600 underline" href="/adminRegister" onClick={()=> console.log("clicked")}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

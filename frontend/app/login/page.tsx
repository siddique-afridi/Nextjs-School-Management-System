"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/constants";
import { mockStudents, mockTeachers } from "@/lib/data";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm, loginSchema } from "../schemas/loginSchema";
import { login } from "../services/auth.service";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [user, setUser] = useState('')
  const router = useRouter();
  console.log("router", router);

  // const setUser = useAuthStore((state) => state.setUser);

  const onSubmit = async(data: LoginForm)=> {
    setLoading(true);
    setApiError("")

    try {
      const response = await login(data)

      saveToken(response.token)
      router.push('/admin')
      
    } catch (error:any) {
       setApiError(
        error.response?.data?.message || "Something went wrong"
      );
      
    }finally{
      setLoading(false)
    }
  }

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 500));

  //   let userToSet = null;
  //   let redirect = "";

  //   if (selectedRole === UserRole.ADMIN) {
  //     // Admin login
  //     if (
  //       email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
  //       password === process.env.NEXT_PUBLIC_ADMIN_PASS
  //     ) {
  //       userToSet = {
  //         id: "admin1",
  //         name: "Admin User",
  //         email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  //         role: UserRole.ADMIN,
  //         avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  //       };
  //       redirect = "/admin";
  //     } else {
  //       setError("Invalid admin credentials");
  //       setLoading(false);
  //       return;
  //     }
  //   } else if (selectedRole === UserRole.TEACHER) {
  //     // Teacher login
  //     const teacher = mockTeachers.find((t) => t.email === email);
  //     if (teacher && password === "teacher123") {
  //       userToSet = teacher;
  //       redirect = "/teacher";
  //     } else {
  //       setError(
  //         "Invalid teacher credentials. Try: john.smith@school.com / teacher123",
  //       );
  //       setLoading(false);
  //       return;
  //     }
  //   } else if (selectedRole === UserRole.STUDENT) {
  //     // Student login
  //     const student = mockStudents.find((s) => s.email === email);
  //     if (student && password === "student123") {
  //       userToSet = student;
  //       redirect = "/student";
  //     } else {
  //       setError(
  //         "Invalid student credentials. Try: alice.johnson@student.com / student123",
  //       );
  //       setLoading(false);
  //       return;
  //     }
  //   }

  //   if (userToSet && redirect) {
  //     setUser(userToSet);
  //     // Wait a bit for state to update before navigating
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //     router.push(redirect);
  //     setLoading(false);
  //   } else {
  //     setError("Login failed. Please try again.");
  //     setLoading(false);
  //   }
  // };

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
              onClick={() => setSelectedRole(UserRole.ADMIN)}
              className="w-full rounded-lg border-2 border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="font-semibold text-foreground">Admin</div>
              <div className="text-sm text-muted-foreground">
                Manage school, classes, and users
              </div>
            </button>

            <button
              onClick={() => setSelectedRole(UserRole.TEACHER)}
              className="w-full rounded-lg border-2 border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="font-semibold text-foreground">Teacher</div>
              <div className="text-sm text-muted-foreground">
                Manage classes and attendance
              </div>
            </button>

            <button
              onClick={() => setSelectedRole(UserRole.STUDENT)}
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
              // setError("");
            }}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Back to role selection
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  : selectedRole === UserRole.TEACHER
                    ? "john.smith@school.com"
                    : "alice.johnson@student.com"
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
             {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
             {...register("password")}
              placeholder="Password"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
             {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
          </div>

          {apiError && (
          <p className="text-red-500">
            {apiError}
          </p>
        )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex justify-center items-center p-2 mt-2 gap-2">
          Don't have an account?{" "}
          <Link className="text-blue-600 underline" href={"/adminRegister"}>
            SignUp
          </Link>{" "}
        </div>

        <div className="mt-0 rounded-lg bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Demo Credentials:
          </p>
          {selectedRole === UserRole.ADMIN && (
            <p className="text-xs text-muted-foreground">
              Email:{" "}
              <code className="bg-background px-1 rounded">
                siddique.afridi@school.com
              </code>{" "}
              | Password:{" "}
              <code className="bg-background px-1 rounded">asdf1234</code>
            </p>
          )}
          {selectedRole === UserRole.TEACHER && (
            <>
              <p className="text-xs text-muted-foreground">
                Email:{" "}
                <code className="bg-background px-1 rounded">
                  john.smith@school.com
                </code>
              </p>
              <p className="text-xs text-muted-foreground">
                Password:{" "}
                <code className="bg-background px-1 rounded">teacher123</code>
              </p>
            </>
          )}
          {selectedRole === UserRole.STUDENT && (
            <>
              <p className="text-xs text-muted-foreground">
                Email:{" "}
                <code className="bg-background px-1 rounded">
                  alice.johnson@student.com
                </code>
              </p>
              <p className="text-xs text-muted-foreground">
                Password:{" "}
                <code className="bg-background px-1 rounded">student123</code>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

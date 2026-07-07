"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AdminRegisterForm,
  adminRegisterSchema,
} from "../schemas/adminRegisterSchema";
import client from "@/lib/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AdminRegisterForm>({
    resolver: zodResolver(adminRegisterSchema),
  });

  const onSubmit = async (data: AdminRegisterForm) => {
    
    try {

      const res = await client.post("/AdminReg", data);
      router.push("/login");
      console.log(res.data)

    } catch (error:any) {
      const field = error.response.data.field;
       setError(field, {
      type: "server",
      message: error.response.data.message,
    })
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-2">
      {/* Left Side */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Admin Register
          </h1>

          <p className="text-gray-600 mb-8">
            Create your own school by registering as an admin.
            <br />
            You will be able to add students and faculty and manage the system.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Full Name
              </label>
              <input
                placeholder="Enter your name"
                {...register("name")}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                School Name
              </label>
              <input
                placeholder="Enter school name"
                {...register("schoolName")}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
              />
              {errors.schoolName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.schoolName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                placeholder="Enter your email"
                type="email"
                {...register("email")}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-violet-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-violet-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-violet-600 py-3 text-white font-medium hover:bg-violet-700 transition"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-600 font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div
        className="hidden md:block bg-center bg-cover"
        style={{
          backgroundImage: "url('/bg-img.png')",
        }}
      />
    </div>
  );
}

export default page;

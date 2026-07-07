"use client";

import { useAuth } from "@/app/context/userContext";

/**
 * In Next.js this is a custom hook (same as React).
 * Admin's _id = school id used in most backend URLs like /Students/:schoolId
 */
export function useSchoolId() {
  const { user } = useAuth();
  return user?._id ?? "";
}

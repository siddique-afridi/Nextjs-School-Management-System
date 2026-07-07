const TOKEN_KEY = "accessToken";
const SESSION_USER_KEY = "sessionUser";

export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const saveSessionUser = (user: unknown) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  }
};

export const getSessionUser = <T>(): T | null => {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const removeSessionUser = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_USER_KEY);
  }
};

export const getDashboardPath = (role: string) => {
  switch (role) {
    case "Admin":
      return "/admin";
    case "Teacher":
      return "/teacher";
    case "Student":
      return "/student";
    default:
      return "/login";
  }
};

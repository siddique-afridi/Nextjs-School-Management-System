"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContextType, AuthUser, LoginCredentials } from "@/lib/constants";
import { removeToken, saveToken } from "@/lib/auth";
import { getMe, login as loginApi, logoutApi } from "@/app/services/auth.service";
import { setUnauthorizedHandler } from "@/lib/client";

type UserProviderProps = { children: ReactNode };

const UserContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    removeToken();
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // still clear local state
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const hydrate = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    setUnauthorizedHandler(clearAuth);
    hydrate();
  }, [hydrate, clearAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: authenticatedUser, token } = await loginApi(credentials);
    setUser(authenticatedUser);
    if (token) saveToken(token);
    return authenticatedUser;
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
    }),
    [user, isLoading, login, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(UserContext);
  if (!context) throw new Error("useAuth must be used within a UserProvider");
  return context;
}

export { getDashboardPath } from "@/lib/auth";

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
import {
  AuthContextType,
  AuthUser,
  LoginCredentials,
  UserRole,
} from "@/lib/constants";
import {
  getDashboardPath,
  getSessionUser,
  removeSessionUser,
  removeToken,
  saveSessionUser,
  saveToken,
} from "@/lib/auth";
import { getMe, login as loginApi, logoutApi } from "@/app/services/auth.service";
import { setUnauthorizedHandler } from "@/lib/client";

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    removeToken();
    removeSessionUser();
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user?.role === UserRole.ADMIN) {
        await logoutApi();
      }
    } catch {
      // Clear local state even if API call fails
    } finally {
      clearAuth();
    }
  }, [user?.role, clearAuth]);

  const hydrate = useCallback(async () => {
    setIsLoading(true);

    const sessionUser = getSessionUser<AuthUser>();
    if (sessionUser) {
      setUser(sessionUser);
      setIsLoading(false);
      return;
    }

    try {
      const admin = await getMe();
      setUser(admin);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth();
    });
    hydrate();
  }, [hydrate, clearAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: authenticatedUser, token } = await loginApi(credentials);
    setUser(authenticatedUser);

    if (authenticatedUser.role === UserRole.ADMIN) {
      if (token) saveToken(token);
      removeSessionUser();
    } else {
      saveSessionUser(authenticatedUser);
      removeToken();
    }

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
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}

export { getDashboardPath };

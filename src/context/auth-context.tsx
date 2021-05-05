import React, { createContext, useState, useContext, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getCurrentUser, login as apiLogin, User } from "src/api";
import { useNotification } from "src/context";
import { Spinner } from "src/components";

export interface AuthProviderValue {
  login: (username: string, password: string) => Promise<User>;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthProviderValue>(undefined);

interface UseUserProps {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useUser({ redirectTo, redirectIfFound }: UseUserProps) {
  const { data: user, mutate: mutateUser, error } = useSWR<User>(
    "/rest/user/me"
  );
  const isAuthenticated = !!user;
  const router = useRouter();
  const hasToken = Cookies.get("token");

  useEffect(() => {
    if ((!redirectTo || !user) && hasToken && !error) {
      return;
    }
    if (
      (redirectTo && !redirectIfFound && !isAuthenticated) ||
      (redirectIfFound && isAuthenticated)
    ) {
      router.replace(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo, isAuthenticated, hasToken, error]);

  return { user, mutateUser };
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { mutateUser } = useUser({ redirectTo: "/login" });

  const login = async (username: string, password: string) => {
    try {
      let current;
      setLoading(true);
      const { data } = await apiLogin(username, password);
      const { jwt, expires } = data;

      if (jwt) {
        Cookies.set("token", jwt, { expires });
        current = await getCurrentUser();
      }

      setLoading(false);
      return current;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    mutateUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

export function ProtectRoute(Component) {
  return (args) => {
    const { user } = useUser({ redirectTo: "/login" });

    if (!user) {
      return null;
    }

    return <Component {...args} />;
  };
}

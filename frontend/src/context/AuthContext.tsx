import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AuthenticatedUser,
  clearAuthStorage,
  fetchCurrentUser,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  LoginResponse,
  persistTokens,
  persistUser,
} from "../services/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  isReady: boolean;
  user: AuthenticatedUser | null;
  login: (tokens: LoginResponse, user?: AuthenticatedUser | null) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const hasTokens = Boolean(getAccessToken() && getRefreshToken());

      if (!hasTokens) {
        setUser(null);
        setIsAuthenticated(false);
        setIsReady(true);
        return;
      }

      setIsAuthenticated(true);
      setUser(getStoredUser());

      try {
        const profile = await fetchCurrentUser();
        setUser(profile);
      } catch {
        clearAuthStorage();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };

    void initializeAuth();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isReady,
      user,
      async login(tokens, nextUser = null) {
        persistTokens(tokens);
        if (nextUser) {
          persistUser(nextUser);
          setUser(nextUser);
        } else {
          const profile = await fetchCurrentUser();
          setUser(profile);
        }
        setIsAuthenticated(true);
      },
      logout() {
        clearAuthStorage();
        setUser(null);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

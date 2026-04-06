import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  department: string;
  access_level: string;
  is_staff: boolean;
}

export interface SignupResponse extends LoginResponse {
  user: AuthenticatedUser;
}

export interface SignupPayload {
  username: string;
  email: string;
  phone: string;
  department: string;
  accessLevel: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetRequestPayload {
  username: string;
  email: string;
}

export interface SignupIdentityValidationPayload {
  username: string;
  email: string;
}

export interface PasswordResetVerifyPayload extends PasswordResetRequestPayload {
  code: string;
}

export interface PasswordResetConfirmPayload extends PasswordResetVerifyPayload {
  newPassword: string;
  confirmPassword: string;
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
}

function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function getErrorMessage(data: unknown, fallbackMessage: string) {
  if (!data || typeof data !== "object") {
    return fallbackMessage;
  }

  const responseData = data as Record<string, unknown>;

  if (typeof responseData.detail === "string") {
    return responseData.detail;
  }

  if (
    Array.isArray(responseData.non_field_errors) &&
    typeof responseData.non_field_errors[0] === "string"
  ) {
    return responseData.non_field_errors[0];
  }

  for (const value of Object.values(responseData)) {
    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }

  return fallbackMessage;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<LoginResponse> | null = null;

async function refreshTokensWithAxios() {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token found.");
  }

  const refreshPath =
    import.meta.env.VITE_AUTH_REFRESH_PATH ?? "/token/refresh/";
  const response = await axios.post<LoginResponse>(
    getApiUrl(refreshPath),
    { refresh },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const nextTokens: LoginResponse = {
    access: response.data.access,
    refresh: response.data.refresh ?? refresh,
  };

  persistTokens(nextTokens);
  return nextTokens;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/token/refresh/")) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    if ((originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry) {
      return Promise.reject(error);
    }

    (originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokensWithAxios().finally(() => {
          isRefreshing = false;
        });
      }

      const tokens = await refreshPromise;
      originalRequest.headers.set("Authorization", `Bearer ${tokens.access}`);
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  },
);

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/token/", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to log in with those credentials."),
      );
    }

    throw error;
  }
}

export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  const registerPath = import.meta.env.VITE_AUTH_REGISTER_PATH ?? "/register/";
  try {
    const response = await api.post<SignupResponse>(registerPath, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to create your account right now."),
      );
    }

    throw error;
  }
}

export async function validateSignupIdentity(payload: SignupIdentityValidationPayload) {
  const validateIdentityPath =
    import.meta.env.VITE_AUTH_VALIDATE_IDENTITY_PATH ?? "/register/validate-identity/";

  try {
    const response = await api.post<{ detail: string }>(validateIdentityPath, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to verify those signup details right now."),
      );
    }

    throw error;
  }
}

export function persistTokens(tokens: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function persistUser(user: AuthenticatedUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthenticatedUser;
  } catch {
    return null;
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export async function fetchCurrentUser() {
  try {
    const response = await api.get<AuthenticatedUser>("/me/");
    persistUser(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to load your profile."),
      );
    }

    throw error;
  }
}

export async function refreshAccessToken() {
  try {
    return await refreshTokensWithAxios();
  } catch (error) {
    clearAuthStorage();

    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Your session has expired. Please log in again."),
      );
    }

    throw error;
  }
}

export { api };

export async function requestPasswordReset(payload: PasswordResetRequestPayload) {
  try {
    const response = await api.post<{ detail: string }>(
      "/password-reset/request/",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to send reset code."),
      );
    }

    throw error;
  }
}

export async function verifyPasswordResetCode(
  payload: PasswordResetVerifyPayload,
) {
  try {
    const response = await api.post<{ detail: string }>(
      "/password-reset/verify-code/",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to verify reset code."),
      );
    }

    throw error;
  }
}

export async function confirmPasswordReset(
  payload: PasswordResetConfirmPayload,
) {
  try {
    const response = await api.post<{ detail: string }>(
      "/password-reset/confirm/",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getErrorMessage(error.response?.data, "Unable to update password."),
      );
    }

    throw error;
  }
}

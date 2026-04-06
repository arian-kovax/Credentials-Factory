interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AUTH_REGISTER_PATH?: string;
  readonly VITE_AUTH_VALIDATE_IDENTITY_PATH?: string;
  readonly VITE_AUTH_REFRESH_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_COZE_API_BASE: string;
  readonly VITE_PICSUM_BASE_URL: string;
  readonly VITE_DEFAULT_AVATAR: string;
  readonly VITE_DEFAULT_COVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
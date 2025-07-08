/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YNAB_ACCESS_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

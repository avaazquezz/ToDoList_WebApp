/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Otras variables de entorno pueden ser añadidas aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
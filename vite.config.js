// Importar el configurador de Vite

// Importar el administrador de rutas
import { resolve } from "node:path";

// Importar Tailwind CSS
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

// Importar utilidades para obtener el directorio actual

import { defineConfig } from "vite";

// Obtener las rutas del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Vite
export default defineConfig({
  // Directorio raíz del frontend
  root: resolve(__dirname, "src"),

  // Plugins
  plugins: [tailwindcss()],

  // Servidor de desarrollo
  server: {
    // Puerto de escucha
    port: 5173,

    // No cambiar de puerto si está ocupado
    strictPort: true,
  },

  // Configuración de compilación
  build: {
    // Directorio de salida
    outDir: resolve(__dirname, "dist"),

    // Limpiar la carpeta de salida antes de compilar
    emptyOutDir: true,

    // Generar manifiesto para Express
    manifest: true,

    // Archivos de entrada
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/main.js"),
      },
    },
  },

  // Desactivar la carpeta pública predeterminada de Vite
  publicDir: false,
});
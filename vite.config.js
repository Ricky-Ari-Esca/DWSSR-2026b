// Importar configurador de Vite
import { defineConfig } from 'vite'

// Importar administrador de rutas
import { resolve } from 'node:path'

// Importar módulos para crear __dirname
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Crear __filename y __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración de Vite
export default defineConfig({

    // Carpeta raíz del frontend
    root: 'src',

    // Servidor de desarrollo
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true
    },

    // Configuración de compilación
    build: {
        outDir: '../dist',
        emptyOutDir: true,

        // Generar manifest
        manifest: true,

        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/main.js')
            }
        }
    },

    // No utilizar publicDir de Vite
    publicDir: false
})
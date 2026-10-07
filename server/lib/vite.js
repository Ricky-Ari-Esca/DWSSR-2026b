// File System
import fs from 'node:fs'

// Manejo de rutas
import path from 'node:path'

// ES Modules
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Crear __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Genera las etiquetas necesarias para Vite.
 *
 * Desarrollo:
 * Utiliza el servidor de Vite.
 *
 * Producción:
 * Utiliza los archivos compilados.
 */
export function viteAssets() {

    const isDev =
        process.env.NODE_ENV !== 'production'

    const viteDevServer =
        process.env.VITE_DEV_SERVER ||
        'http://localhost:5173'

    // --------------------------------------------------
    // DESARROLLO
    // --------------------------------------------------

    if (isDev) {

        return `
        <script type="module"
            src="${viteDevServer}/@vite/client">
        </script>

        <script type="module"
            src="${viteDevServer}/main.js">
        </script>
        `
    }

    // --------------------------------------------------
    // PRODUCCIÓN
    // --------------------------------------------------

    const manifestPath = path.join(
        __dirname,
        '..',
        '..',
        'dist',
        '.vite',
        'manifest.json'
    )

    // Verificar manifest
    if (!fs.existsSync(manifestPath)) {

        console.warn(
            "⚠️ Vite manifest no encontrado. Ejecuta 'npm run build'"
        )

        return ''
    }

    // Leer manifest
    let manifest

    try {

        const manifestContent =
            fs.readFileSync(
                manifestPath,
                'utf-8'
            )

        manifest =
            JSON.parse(manifestContent)

    } catch (error) {

        console.error(
            '❌ Error leyendo manifest:',
            error
        )

        return ''
    }

    // Obtener main.js
    const mainEntry =
        manifest['main.js']

    if (!mainEntry) {

        console.warn(
            '⚠️ main.js no está disponible en el manifest'
        )

        return ''
    }

    let tags = ''

    // --------------------------------------------------
    // CSS
    // --------------------------------------------------

    if (mainEntry.css) {

        mainEntry.css.forEach(cssFile => {

            tags +=
                `<link rel="stylesheet" href="/${cssFile}">\n`

        })
    }

    // --------------------------------------------------
    // JAVASCRIPT
    // --------------------------------------------------

    if (mainEntry.file) {

        tags +=
            `<script type="module" src="/${mainEntry.file}" defer></script>\n`
    }

    return tags
}

/**
 * Registrar helper en Handlebars
 */
export function registerViteHelper(hbs) {

    hbs.registerHelper(
        'viteAssets',
        () => {

            return new hbs.SafeString(
                viteAssets()
            )

        }
    )
}

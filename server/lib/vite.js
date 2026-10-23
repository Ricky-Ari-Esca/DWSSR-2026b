/**
 * Biblioteca de archivos y rutas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Biblioteca Debug.
import createDebug from 'debug';

// Creación del objeto Debug.
const debug = createDebug('dwssr-2026b:server');

// Creación de las variables de rutas.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Helper para Handlebars que genera las etiquetas de Vite.
 *
 * En desarrollo: conecta al servidor de desarrollo de Vite.
 * En producción: utiliza los archivos compilados de Vite.
 *
 * @returns {string} Etiquetas HTML para cargar los recursos de Vite.
 */
export function viteAssets() {
  // Obtener el modo de ejecución.
  const isDev = process.env.NODE_ENV !== 'production';

  // Obtener la URL del servidor de desarrollo.
  const viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173';

  // Si estamos en modo desarrollo.
  if (isDev) {
    return `
      <script type="module" src="${viteDevServer}/@vite/client"></script>
      <script type="module" src="${viteDevServer}/main.js"></script>
    `;
  }

  // Ruta del manifiesto generado por Vite.
  const manifestPath = path.join(__dirname, '..', '..', 'dist', '.vite', 'manifest.json');

  // Comprobar si existe el manifiesto.
  if (!fs.existsSync(manifestPath)) {
    debug("Vite manifest not found. Run 'npm run build'");
    return '';
  }

  // Leer y analizar el manifiesto JSON.
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Obtener el punto de entrada del frontend.
  const mainEntry = manifest['main.js'];

  // Comprobar si existe el archivo principal.
  if (!mainEntry) {
    debug('Archivo main.js no está disponible en el manifiesto de Vite');
    return '';
  }

  // Inicializar las etiquetas HTML.
  let tags = '';

  // Agregar los archivos CSS.
  if (mainEntry.css) {
    mainEntry.css.forEach((cssFile) => {
      tags += `<link rel="stylesheet" href="/${cssFile}">\n`;
    });
  }

  // Agregar el archivo JavaScript principal.
  tags += `<script type="module" src="/${mainEntry.file}" defer></script>`;

  return tags;
}

/**
 * Registrar el helper de Vite en Handlebars.
 *
 * @param {object} hbs - Instancia de Handlebars.
 */
export function registerViteHelper(hbs) {
  hbs.registerHelper('viteAssets', () => new hbs.SafeString(viteAssets()));
}

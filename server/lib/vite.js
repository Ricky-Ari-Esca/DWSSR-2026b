// Biblioteca File Stream
import fs from 'node:fs';

// Biblioteca de rutas
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Crear las variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Helper para Handlebars que genera las etiquetas de Vite.
 *
 * EN DESARROLLO: conecta al servidor de desarrollo de Vite.
 * EN PRODUCCIÓN: utiliza los archivos compilados de Vite.
 */
export function viteAssets() {
  // Obtener el modo de ejecución
  const isDev = process.env.NODE_ENV !== 'production';

  // URL del servidor de desarrollo de Vite
  const viteDevServer =
    process.env.VITE_DEV_SERVER || 'http://localhost:5173';

  // Si estamos en desarrollo
  if (isDev) {
    return `
      <script type="module" src="${viteDevServer}/@vite/client"></script>
      <script type="module" src="${viteDevServer}/main.js"></script>
    `;
  }

  // Ruta del manifest generado por Vite
  const manifestPath = path.join(
    __dirname,
    '..',
    '..',
    'dist',
    '.vite',
    'manifest.json'
  );

  // Comprobar si existe el manifest
  if (!fs.existsSync(manifestPath)) {
    console.warn("Vite manifest no encontrado. Ejecuta 'npm run build'.");
    return '';
  }

  // Leer y convertir el manifest a JSON
  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf-8')
  );

  // Obtener el punto de entrada del frontend
  const mainEntry = manifest['main.js'];

  if (!mainEntry) {
    console.warn(
      'El archivo main.js no está disponible en el manifest de Vite.'
    );
    return '';
  }

  let tags = '';

  // Generar las etiquetas CSS
  if (mainEntry.css) {
    mainEntry.css.forEach((cssFile) => {
      tags += `<link rel="stylesheet" href="/${cssFile}">\n`;
    });
  }

  // Generar la etiqueta JavaScript
  tags += `<script type="module" src="/${mainEntry.file}"></script>`;

  return tags;
}

/**
 * Registrar el helper de Handlebars
 */
export function registerViteHelper(hbs) {
  hbs.registerHelper('viteAssets', () => {
    return new hbs.SafeString(viteAssets());
  });
}
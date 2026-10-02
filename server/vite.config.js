//Importando configuracion de vite 
import { defineConfig } from 'vite';
// Importando un admin de ruta
import resolve from 'node:path';

export default defineConfig({
  //directorio raiz de los archivos fuentes del front-end
    root: "src",
    //configuración de servidor de desarrollo
    server: {
        // puerto de escucha
        port: 5173,
        //Rigidez del puerto
        strict: true
    },
    // Configuración de Build
    build: {
        // Directorio de salida del js para produccion
        outDir: "../dist",
        // asegurando limpieza del folder de prod//
        emptyOutDir: true,
        // minificación del código para producción
        minifest: true,
        //opciones de empaquetado
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/main.js")
            }
        }
    },
    //configuracion para desarrollo
    publicDir: false
});
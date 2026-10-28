// Función para manejar errores en la aplicación.
import createError from 'http-errors';

// Importar el framework Express.
import express from 'express';

// Importar módulos para manejar rutas.
import path, { dirname } from 'node:path';

// Importar módulos para manejar cookies.
import cookieParser from 'cookie-parser';

// Importar módulos para manejar logs.
import logger from 'morgan';

// Importar biblioteca de debug.
import createDebug from 'debug';

// Importar funciones para obtener __filename y __dirname.
import { fileURLToPath } from 'node:url';

// Importar el motor de plantillas Handlebars.
import hbs from 'hbs';

// Importar las rutas de la aplicación.
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';

// Importar el helper de Vite.
import { registerViteHelper } from './lib/vite.js';

// Crear el objeto Debug.
const debug = createDebug('dwssr-2026b:server');

// Obtener las rutas del archivo actual.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear la aplicación Express.
debug('🔨 Creando backend');

const app = express();

// Configurar el motor de vistas con HBS.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar el helper de Vite.
registerViteHelper(hbs);

// Configurar los middlewares de la aplicación.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estáticos para producción.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Configurar la carpeta de archivos estáticos públicos.
debug('🔨 Configurando archivos estáticos');

app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas de la aplicación.
debug('🛣️ Registrando rutas');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturar errores 404 y enviarlos al manejador de errores.
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores.
app.use((err, req, res, _next) => {
  // Mostrar el mensaje del error.
  res.locals.message = err.message;

  // Mostrar detalles solamente en desarrollo.
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar la página de error.
  res.status(err.status || 500);
  res.render('error');
});

// Exportar la aplicación.
export default app;
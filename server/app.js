// Importar módulo para manejar errores
import createError from 'http-errors';

// Importar el framework Express
import express from 'express';

// Importar módulo para manejar rutas
import path from 'node:path';

// Importar módulo para manejar cookies
import cookieParser from 'cookie-parser';

// Importar módulo para generar logs
import logger from 'morgan';

// Importar biblioteca Debug
import createDebug from 'debug';

// Importar funciones para crear __dirname
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Crear el objeto Debug
const debug = createDebug('dwssr-2026b:server');

// Crear las variables __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar las rutas de la aplicación
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Crear la aplicación Express
debug('🔨 Creando backend');

const app = express();

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configurar middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configurar archivos estáticos
debug('🔨 Creando servidor de archivos estáticos');

app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas
debug('🛣️ Registrando rutas');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturar errores 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.locals.message = err.message;

  res.locals.error =
    req.app.get('env') === 'development'
      ? err
      : {};

  res.status(err.status || 500);
  res.render('error');
});

// Exportar la aplicación
export default app;
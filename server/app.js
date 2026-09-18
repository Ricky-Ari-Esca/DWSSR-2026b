// Función para manejar errores de la aplicación
var createError = require('http-errors');

// Importa el framework Express
var express = require('express');

// Importa módulo para manejar rutas
var path = require('path');

// Importa módulo para manejar cookies
var cookieParser = require('cookie-parser');

// Importa módulo para manejar logs
var logger = require('morgan');

// Importa las rutas de la aplicación
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Crea la aplicación Express
var app = express();

// Configura el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configuración de middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configura la carpeta de archivos públicos
app.use(express.static(path.join(__dirname, 'public')));

// Configura las rutas de la aplicación
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Captura de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {

  // Configuración de variables locales
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Código de estado
  res.status(err.status || 500);

  // Renderiza la página de error
  res.render('error');
});

// Exporta la aplicación
module.exports = app;

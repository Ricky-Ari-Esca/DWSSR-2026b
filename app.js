//Funcion para manejar errores de la aplicacion
var createError = require('http-errors');
// importa el framework express
var express = require('express');
// importa modulo para manejar rutas
var path = require('path');
//importa modulo para manejar cookies 
var cookieParser = require('cookie-parser');
// importa modulo para manejar logs
var logger = require('morgan');

//Importa las rutas de la aplicacion
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//crea la aplicacion express
var app = express();

// configura el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// configura las rutas de la aplicacion
app.use('/', indexRouter);
app.use('/users', usersRouter);

// captura de errores 404 y reenvio al manejador de errores
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

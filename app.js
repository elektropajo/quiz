
/* PAQUETES CON MIDDLEWARES */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //añadido

/* ENRUTADORES */

var routes = require('./routes/index');

/* CREAR APLICACIÓN */

var app = express();

/* GENERADOR DE VISTAS */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

/* INSTALACIÓN DE MIDDLEWARES */

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/* INSTALACIÓN DE ENRUTADORES */

app.use('/', routes);

/* GESTIÓN DEL RESTO DE RUTAS */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* GESTIÓN DE ERRORES */

// Errores durante desarrollo (con trazas)
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Errores en producción (sin trazas)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* EXPORTA APP PARA EL COMANDO DE ARRANQUE */

module.exports = app;

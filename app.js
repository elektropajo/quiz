/* PAQUETES CON MIDDLEWARES */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //añadido
var methodOverride = require('method-override'); //añadido
var session = require('express-session'); //añadido

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
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz2015')); // Semilla 'Quiz 2015' para cifrar cookie
app.use(session());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

/* HELPERS DINÁMICOS añadidos junto al middleware de sesión */
app.use(function(req, res, next) {
  // Guarda path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las VISTAS
  res.locals.session = req.session;
  next();
});

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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var pool = require('./models/bd');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "h27hh7iy1iñv6v4hti",
  resave: false,
  saveUninitialized: true
}));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/', function (req, res) {
  var conocido = Boolean(req.session.nombre);

  res.render('index', {
    title: "Sessiones en Express.js",
    conocido: conocido,
    nombre: req.session.nombre
  });

});

app.post('/ingresar', function (req, res){
  if (req.body.nombre) {
    req.session.nombre = req.body.nombre
  }
  res.redirect('/');
});

app.get('/salir', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

pool.query('select * from empleados').then(function (resultados) {
   console.log(resultados)
});

// insertar

var obj = {
  nombre: 'Juan',
  apellido: 'Lopez',
  trabajo: 'docente',
  edad: 38,
  salario: 1500,
  mail: 'juanlopez@gmail.com'
}

pool.query('insert into empleados set ?', [obj]).then(function (resultados) {
   console.log(resultados);
});

//modificar

var id = 5;
var obj = {
  nombre: 'Pablo',
  apellido: 'Gomez'
}

pool.query('update empleados set ? where id_emp=?', [obj, id]).then(function (resultados) {
   console.log(resultados);
});

//borrar 

var id = 5;
pool.query('delete form empleados where id_emp=?', [id]).then(function (resultados) {
   console.log(resultados);
});


// catch 404 and forward to error handler
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


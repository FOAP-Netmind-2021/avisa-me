// Trata los archivos .env que este en /root como variables globales.
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const nodeCron = require('node-cron');


// Importing routes
const indexRouter = require('./routes/index');
const taskRouter = require('./routes/taskRoutes');
const settingsRouter = require('./routes/settingsRoutes');
const userRouter = require('./routes/userRoutes');

// Importing utils
const reminderScript = require('./utils/reminderScript');

// Initializations
const app = express();
require("./config/passport");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Guarda los mensajes en el servidor
app.use(
  session({
      secret: "secret",
      resave: true,
      saveUninitialized: true
  })
);
app.use(passport.initialize()); // Inicializa passport
app.use(passport.session()); // Inicializa la session de express con passport
app.use(flash()); // Inicializa connect-flash


// Global Variables - Middleware propio.
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); // Variable global "success_msg" en todo el REQuest.flash 
  res.locals.error_msg = req.flash("error_msg"); // Variable global "error_msg" en todo el REQuest.flash 
  res.locals.user = req.user || null; // Variable global "user" en todo el REQuest.flash - Saber si existe usuario autenticado 
  res.locals.noti_msg = req.flash("noti_msg");
  next(); // Obliga a continuar hacía adelante.
});

// Auto run script
nodeCron.schedule('*/5 * * * *', () => {
  reminderScript.reminderNotificate();
});

// Routes. Importing from another file
app.get('/favicon.ico', (req, res) => res.status(204).send());
app.use('/', indexRouter);
app.use('/tasks', taskRouter);
app.use("/settings", settingsRouter);
app.use("/user", userRouter);

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
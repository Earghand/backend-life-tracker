var createError = require('http-errors');
var express = require('express');
var path = require('path');
const morgan = require("morgan")
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { BadRequestError, NotFoundError } = require("./utils/errors")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); 
var authRoutes = require("./routes/auth")
var tests = require("./routes/testing")
var sleeping = require("./routes/sleeps")
const security = require("./middleware/security")
const { PORT } = require('./config');


var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(morgan("tiny"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//for every request, check if a token exists
//in the authorization header
//if it does, attach the decoded user to res.locals.
app.use(security.extractUserFromJwt)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/auth", authRoutes)
app.use("/testing", tests);
app.use("/sleep", sleeping);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req,res,next) => {
  return next(new NotFoundError())
})

app.use((err, req,res,next) => {
  const status = err.status || 500
  const message = err.message;

  return res.status(status).json({
    error: { message, status},
  })
})

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

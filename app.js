var createError = require('http-errors');
var express = require('express');
require('dotenv').config()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var applicationFormRouter = require('./routes/applicationForm');
var courseRouter = require('./routes/course');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var cors = require('cors');
var app = express();

app.use(cors());
// database connection 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));

// authentication route
app.use('/', indexRouter);

// check api token
app.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
      jwt.verify(token, process.env.SECERT_KEY, function(err, decoded) {
          if (err) {
              return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
              req.decoded = decoded;
              next();
          }
      });
  } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
  }
});

// appliction-form route
app.use('/application-form', applicationFormRouter);

// course route
app.use('/course', courseRouter);

// users route
app.use('/users', usersRouter);

// upload route
app.use('/upload', uploadRouter);

app.get('/images/:name', function(req, res) {
  fs.readFile(`uploads/${req.params.name}`, function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    else {
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data); // Send the file data to the browser.
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

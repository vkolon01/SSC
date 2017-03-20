var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var reload = require('reload');
var expressSession = require('express-session');
var port = 3000;
var app = express();

//database connection
var mongoose = require('mongoose'),
    mongo_session = require('connect-mongo')(expressSession);
mongoose.connect('mongodb://localhost/SSC');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Common local attributes.
app.use(function(req,res,next){
  res.locals.siteTitle = "SSC";
  next();
});

//Routes
app.use(require('./controllers'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/*
Giving the app access to the following variables.
 */
app.set('port',port);

var server = app.listen(app.get('port'),function(){
  console.log('listening on port ' + app.get('port'))
});

reload(server,app);

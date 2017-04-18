var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var reload = require('reload');
var session = require('express-session');
var port = 3000;
var app = express();
var validator = require('express-validator');

//database connection
var mongoose = require('mongoose'),
    mongoBase = require('connect-mongo')(session);
mongoose.connect('mongodb://localhost/SSC');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '1245-FDDDD-FSdewfgf',
  saveUninitialized: true,
  resave: false,
  store: new mongoBase({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native'
  }),
  cookie: {maxAge: 180*60*1000} //2 hours
}));

//Routes
app.use(require('./controllers/index'));

//Registration and login routes are loaded separately to avoid permission handling middleware.
app.use('/registration',require('./controllers/registration'));
app.use('/login',require('./controllers/login'));

//Common local attributes.
app.locals.siteTitle = "SSC";
app.use(express.static('app/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(res.redirect('/login'));
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

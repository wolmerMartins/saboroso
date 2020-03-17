var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var formidable = require('formidable');
var path = require('path');
var http = require('http');
var socket = require('socket.io');

var app = express();
var http = http.Server(app);
var io = socket(http);

io.on('connection', socket => console.log('Novo usuário conectado!'));

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

var client = redis.createClient({
  host: 'localhost',
  port: 6379
});

app.use(function(req, res, next) {
  req.body = {};

  if (req.method === 'POST') {
    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
      req.body = fields;
      req.fields = fields;
      req.files = files;
  
      next();
    });
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store: new RedisStore({ client }),
  secret: 'p@ssw0rd',
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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

http.listen(3000, () => console.log('Servidor em execução...'));

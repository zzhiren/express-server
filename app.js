var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var mongoose = require('mongoose');
var proxy = require('http-proxy-middleware');

var app = express();
var common = require('./routes/common');
var schedule = require('node-schedule');
//链接mongo数据库
var promise = mongoose.connect('mongodb://127.0.0.1:27017/server', {
  useMongoClient: true,
  /* other options */
});

// 定时更新github项目信息
var githubProject = schedule.scheduleJob({ hour: 22, minute: 56, dayOfWeek: [0, 1, 2, 3, 4, 5, 6] }, common.updateGitHubProject);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//这句话的意思就是说，凡是你的ajax请求里面带api的 就还会自动帮你向http://www.example.com这里进行数据请求
// app.use('/searchnpm', proxy({ target: 'https://www.npmjs.com/-/search', changeOrigin: true })); 

module.exports = app;




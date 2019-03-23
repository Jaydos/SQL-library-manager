var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');

var booksRouter = require('./routes/books');

var app = express();

// Serve static files.
app.use('/static', express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Forward requests to Router
app.use('/', (booksRouter));

// 404 Error only hits when no matching routes are found
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  console.log(error.status)
  if(error.status === 404){
    res.render('page-not-found')
  } else {
    res.render('error');
  }
})

module.exports = app;

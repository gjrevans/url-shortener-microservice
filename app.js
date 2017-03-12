var express = require('express'),
    nunjucks  = require('nunjucks'),
    path = require('path'),
    app = express(),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),

app.set('assets_path', (process.env.NODE_ENV === 'production') ? 'dist' : 'build');
app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, app.get('assets_path'))));

var	routes = require('./routes/pages'),
    api_routes = require('./routes/shorten');

app.set('port', process.env.PORT || 8000);

// Setup nunjucks templating engine
nunjucks.configure(app.get('views'), {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

// serve index and view partials
app.use('/', routes);
app.use('/api/', api_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('404.html');
});

// Kick start our server
app.listen(app.get('port'), function() {
    console.log('Server started on port', app.get('port'));
});

module.exports = app;

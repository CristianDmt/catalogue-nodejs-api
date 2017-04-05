/* App Dependencies */
var express = require('express');
var expressFavicon = require('express-favicon');
// var expressLogger = require('express-logger');
var expressLogger = require('morgan');
var expressMethodOverride = require('express-method-override');
var expressErrorHandler = require('express-error-handler');

var bodyParser = require('body-parser');

var controllers = require('./controllers');
var authController = require('./controllers/Auth');
var instController = require('./controllers/Institution');
var classController = require('./controllers/Class');
var courseController = require('./controllers/Course');

var permissionMiddleware = require('./middleware/Permission');

/* Keep Enabled in Production */
// console.log = function(){};

var http = require('http');
var path = require('path');
var models = require('./models');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressFavicon());
app.use(expressLogger('dev'));
// app.use(expressLogger({ path: './config/app.log' }));
app.use(expressMethodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(expressErrorHandler());
}

// Frontend Templates
console.log('Frontend components have been loaded...');

// Mounting Middleware API
app.use('/api/:token/*', permissionMiddleware.retrieveGlobalPermission);

// Backend Auth API Routes
app.post('/api/auth/create', authController.createAuth);
app.post('/api/auth/request', authController.requestToken);
app.get('/api/auth/validate/:token', authController.validateToken);
app.get('/api/auth/validate', authController.validateToken);

// Institution API Routes
app.post('/api/:token/institution/create', instController.createInstitution);
app.get('/api/:token/institution/list', instController.listInstitution);
app.get('/api/:token/institution/delete/:id', instController.deleteInstitution);
app.get('/api/:token/institution/delete', instController.deleteInstitution);

// Classes API Routes
app.post('/api/:token/class/create/:inst', classController.createClass);
app.post('/api/:token/class/create', classController.createClass);
app.get('/api/:token/class/list/:inst', classController.listClass);
app.get('/api/:token/class/list', classController.listClass);
app.get('/api/:token/class/delete/:id', classController.deleteClass);
app.get('/api/:token/class/delete', classController.deleteClass);

// Course API Routes
app.post('/api/:token/course/create/:inst', courseController.createCourse);
app.post('/api/:token/course/create', courseController.createCourse);
app.get('/api/:token/course/list/:inst', courseController.listCourse);
app.get('/api/:token/course/list', courseController.listCourse);
app.get('/api/:token/course/delete/:id', courseController.deleteCourse);
app.get('/api/:token/course/delete', courseController.deleteCourse);

console.log('Backend API has been loaded...');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Started server on port ' + app.get('port') + '...');
});

app.get('/api*', controllers.index);
app.post('/api*', controllers.index);
app.get('/*', controllers.index);

/*app.use(function (req, res) {
    res.render('index', {
        title: 'VirtualCatalogue'
    });
});*/

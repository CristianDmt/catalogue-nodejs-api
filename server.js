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
var requestController = require('./controllers/Request');
var instController = require('./controllers/Institution');
var classController = require('./controllers/Class');
var courseController = require('./controllers/Course');
var associateController = require('./controllers/Associate');
var permissionController = require('./controllers/Permission');
var searchController = require('./controllers/Search');

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
// app.use(expressLogger({ path: './config/app.log' })); // Keep Enabled in Production
app.use(expressMethodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(expressErrorHandler());
}

// Frontend Templates
app.get('/template/demo/1', function(req, res) { res.render('demo1') });
app.get('/template/demo/2', function(req, res) { res.render('demo2') });
app.get('/template/demo/3', function(req, res) { res.render('demo3') });
app.get('/template/parent/student/list', function(req, res) { res.render('parentStudentList') });
app.get('/template/parent/student/situation', function(req, res) { res.render('parentStudentSituation') });
console.log('Frontend components have been loaded...');

// Mounting Middleware API
app.use('/api/*', permissionMiddleware.retrieveGlobalPermission); // /api/*?token=API_TOKEN

// Backend Auth API Routes
app.post('/api/auth/create', authController.createAuth);
app.post('/api/auth/request', authController.requestToken);
app.get('/api/auth/validate/:token', authController.validateToken);
app.get('/api/auth/validate', authController.validateToken);

// Request API Routes
app.get('/api/request/make/:inst', requestController.makeRequest);
app.get('/api//request/make', requestController.makeRequest);
app.get('/api/request/cancel/:inst', requestController.cancelRequest);
app.get('/api/request/cancel', requestController.cancelRequest);
app.get('/api/request/accept/:req', requestController.acceptRequest);
app.get('/api/request/accept', requestController.acceptRequest);
app.get('/api/request/deny/:req', requestController.denyRequest);
app.get('/api/request/deny', requestController.denyRequest);

// Institution API Routes
app.post('/api/institution/create', instController.createInstitution);
app.get('/api/institution/list', instController.listInstitution);
app.get('/api/institution/delete/:id', instController.deleteInstitution);
app.get('/api/institution/delete', instController.deleteInstitution);

// Classes API Routes
app.post('/api/class/create/:inst', classController.createClass);
app.post('/api/class/create', classController.createClass);
app.get('/api/class/list/:inst', classController.listClass);
app.get('/api/class/list', classController.listClass);
app.get('/api/class/delete/:id', classController.deleteClass);
app.get('/api/class/delete', classController.deleteClass);

// Course API Routes
app.post('/api/course/create/:inst', courseController.createCourse);
app.post('/api/course/create', courseController.createCourse);
app.get('/api/course/list/:inst', courseController.listCourse);
app.get('/api/course/list', courseController.listCourse);
app.get('/api/course/delete/:id', courseController.deleteCourse);
app.get('/api/course/delete', courseController.deleteCourse);

// Search API Routes
app.post('/api/search', searchController.querySearch);

// Demo API Routes
app.get('/api/demo', associateController.demoAssoc);

console.log('Backend API has been loaded...');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Started server on port ' + app.get('port') + '...');
});

app.get('/api*', controllers.index);
app.post('/api*', controllers.index);
app.get('/*', controllers.index);

/* App Dependencies */
var express = require('express');
var bodyParser = require('body-parser');

var api = {};
var controllers = require('./controllers');
var authController = require('./controllers/Auth');
var instController = require('./controllers/Institution');
var classController = require('./controllers/Class');

var http = require('http');
var path = require('path');
var models = require('./models');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Frontend Templates
console.log('Frontend components have been loaded...');

// Backend API Routes
app.post('/api/auth/create', authController.createAuth);
app.post('/api/auth/request', authController.requestToken);
app.get('/api/auth/validate/:token', authController.validateToken);
app.get('/api/auth/validate', authController.validateToken);

// Institution API Routes
app.post('/api/institution/create', instController.createInstitution);
app.get('/api/institution/list', instController.listInstitution);
app.get('/api/institution/delete/:id', instController.deleteInstitution);
app.get('/api/institution/delete', instController.deleteInstitution);

// Classes API Routes
app.post('/api/class/create/:inst', classController.createClass);
app.post('/api/class/create', classController.createClass);
app.get('/api/class/create', classController.createClass);
app.get('/api/class/list/:inst', classController.listClass);
app.get('/api/class/list', classController.listClass);
app.get('/api/class/delete/:id', classController.deleteClass);
app.get('/api/class/delete', classController.deleteClass);
console.log('Backend API has been loaded...');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Started application on port ' + app.get('port') + '...');
});

app.get('/api*', controllers.index);
app.post('/api*', controllers.index);
app.get('/', controllers.index);

/*app.use(function (req, res) {
    res.render('index', {
        title: 'VirtualCatalogue'
    });
});*/

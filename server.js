/* App Dependencies */
var express = require('express');
var bodyParser = require('body-parser');

var api = {};
var controllers = require('./controllers');
var authController = require('./controllers/Auth');

var http = require('http');
var path = require('path');
var models = require("./models");
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

app.get('/', controllers.index);

// Frontend Templates
console.log('Frontend components have been loaded...');

// Backend API Routes
app.post('/api/auth/create', authController.createAuth);
//app.post('/api/auth/request', authController.makeKey);
//app.post('/api/auth/validate', auth.validateKey());
console.log('Backend API has been loaded...');

http.createServer(app).listen(app.get('port'), function() {
    console.log('Started application on port ' + app.get('port') + '...');
});

/*app.use(function (req, res) {
    res.render('index', {
        title: 'VirtualCatalogue'
    });
});*/

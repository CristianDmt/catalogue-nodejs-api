"use strict";

var fs = require("fs");
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var db = require('mongoose');
db.connect(config.protocol + '://' + config.host + '/' + config.database);
db.Promise = global.Promise;

module.exports = db;

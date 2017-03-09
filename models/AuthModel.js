"use strict";

var Database = require('../models/index');

console.log("Compiling Authentication Schema...");
var authSchema = new Database.Schema({
        username: String,
        password: String,
        passwordSalt: String,
        registerDate: Date,
        registerIP: String
    }, {
        versionKey: false
    }
);

console.log("Exporting Authentication Model...");
var authModel = Database.model('Auth', authSchema, 'Auths');

module.exports = authModel;
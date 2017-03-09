"use strict";

var Database = require('../models/index');

console.log("Compiling Authentication Token Schema...");
var authTokenSchema = new Database.Schema({
        authId: String,
        token: String,
        restrictedIP: String,
        restrictedAgent: String,
        createdAt: { type: Date, default: Date.now() },
        expiresAt: { type: Date, default: Date.now() }
    }, {
        versionKey: false
    }
);

console.log("Exporting Authentication Token Model...");
var authTokenModel = Database.model('AuthToken', authTokenSchema, 'AuthTokens');

module.exports = authTokenModel;
"use strict";

var Database = require('../models/index');

console.log("Compiling Request Schema...");
var requestSchema = new Database.Schema({
        instId: { type: String, required: true },
        authId: { type: String, required: true },
        createdDate: { type: Date, default: Date.now() },
        processed: { type: Boolean, default: false }
    }, {
        versionKey: false
    }
);

console.log("Exporting Request Model...");
var requestModel = Database.model('Request', requestSchema, 'Requests');

module.exports = requestModel;
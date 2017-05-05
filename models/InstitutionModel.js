"use strict";

var Database = require('../models/index');

console.log("Compiling Institution Schema...");
var instSchema = new Database.Schema({
        _strId: { type: String, default: "" }, // self.String
        name: String,
        countryCode: { type: String, default: "" },
        city: { type: String, default: "" },
        createdDate: { type: Date, default: Date.now() }
    }, {
        versionKey: false
    }
);

console.log("Exporting Institution Model...");
var instModel = Database.model('Institution', instSchema, 'Institutions');

module.exports = instModel;
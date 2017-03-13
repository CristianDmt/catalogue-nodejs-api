"use strict";

var Database = require('../models/index');

console.log("Compiling Institution Schema...");
var instSchema = new Database.Schema({
        name: String,
        foundedDate: { type: Date, default: Date.now() }
    }, {
        versionKey: false
    }
);

console.log("Exporting Institution Model...");
var instModel = Database.model('Institution', instSchema, 'Institutions');

module.exports = instModel;
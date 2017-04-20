"use strict";

var Database = require('../models/index');

console.log("Compiling Association :: Master -> Class Schema...");
var associateMasterClassSchema = new Database.Schema({
        instId: { type: String, required: true },
        masterId: { type: String, required: true },
        classId: { type: String, required: true },
        assocDate: { type: Date, default: Date.now() },
        assocBy: String
    }, {
        versionKey: false
    }
);

console.log("Exporting Association :: Master -> Class Model...");
var associateMasterClassModel = Database.model('AssociateMasterClass', associateMasterClassSchema, 'AssociateMasterClasses');

module.exports = associateMasterClassModel;
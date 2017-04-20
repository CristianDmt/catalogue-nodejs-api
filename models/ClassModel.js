"use strict";

var Database = require('../models/index');

console.log("Compiling Class Schema...");
var classSchema = new Database.Schema({
        instId: String,
        name: { type: String, required: true },
        createdDate: Date,
        completed: { type: Boolean, default: false }
    }, {
        versionKey: false
    }
);

console.log("Exporting Class Model...");
var classModel = Database.model('Class', classSchema, 'Classes');

module.exports = classModel;
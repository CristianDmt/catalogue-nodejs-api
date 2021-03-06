"use strict";

var Database = require('../models/index');

console.log("Compiling Course Schema...");
var courseSchema = new Database.Schema({
        _strId: { type: String, default: "" }, // self.String
        instId: String,
        name: { type: String, required: true },
        createdDate: Date
    }, {
        versionKey: false
    }
);

console.log("Exporting Course Model...");
var courseModel = Database.model('Course', courseSchema, 'Courses');

module.exports = courseModel;
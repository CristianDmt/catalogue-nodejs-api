"use strict";

var Database = require('../models/index');

console.log("Compiling Association :: Course -> Class Schema...");
var associateCourseClassSchema = new Database.Schema({
        instId: { type: String, required: true },
        courseId: { type: String, required: true },
        classId: { type: String, required: true },
        assocDate: { type: Date, default: Date.now() },
        assocBy: String
    }, {
        versionKey: false
    }
);

console.log("Exporting Association :: Course -> Class Model...");
var associateCourseClassModel = Database.model('AssociateCourseClass', associateCourseClassSchema, 'AssociateCourseClasses');

module.exports = associateCourseClassModel;
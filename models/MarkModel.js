"use strict";

var Database = require('../models/index');

console.log("Compiling Mark Schema...");
var markSchema = new Database.Schema({
        instId: String,
        classId: String,
        courseId: String,
        studentId: String,
        teacherId: String,
        mark: { type: Integer, default: 1 },
        period: { type: Integer, default: 1 },
        type: { type: String, default: 'mark' },
        createdDate: Date
    }, {
        versionKey: false
    }
);

console.log("Exporting Mark Model...");
var markModel = Database.model('Mark', markSchema, 'Marks');

module.exports = markModel;
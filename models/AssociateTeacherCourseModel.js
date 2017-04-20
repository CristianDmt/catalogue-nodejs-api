"use strict";

var Database = require('../models/index');

console.log("Compiling Association :: Teacher -> Course Schema...");
var associateTeacherCourseSchema = new Database.Schema({
        instId: { type: String, required: true },
        teacherId: { type: String, required: true },
        courseId: { type: String, required: true },
        assocDate: { type: Date, default: Date.now() },
        assocBy: String
    }, {
        versionKey: false
    }
);

console.log("Exporting Association :: Teacher -> Course Model...");
var associateTeacherCourseModel = Database.model('AssociateTeacherCourse', associateTeacherCourseSchema, 'AssociateTeacherCourses');

module.exports = associateTeacherCourseModel;
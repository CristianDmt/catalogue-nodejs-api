"use strict";

var Database = require('../models/index');
var Course = require('../models/CourseModel');

var Moment = require('moment');

exports.createCourse = function(instId, courseName, callback) {
    if(typeof(courseName) == 'undefined' || courseName.length < 3 || courseName.length > 100) {
        callback(null, 'course_invalid_name');
    }

    var newCourse = new Course({
        instId: instId,
        name: courseName,
        createdDate: Moment()
    });

    newCourse.save().then(function(success) {
        return callback(null, 'course_created');
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error');
    });
}

exports.listCourse = function(instId, callback) {
    Course.find({ instId: instId }, 'name').then(function(jsonData) {
        if(jsonData) {
            return callback(null, 'course_list_retrieved', jsonData);
        }
        else {
            return callback(null, 'institution_not_existent', jsonData);
        }
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error', null);
    });
}

exports.getCourse = function(courseId, callback) {
    Course.findOne({ _id: courseId }, {}).then(function(jsonData) {
        if(jsonData) {
            callback(null, jsonData);
        }
        else {
            callback(null, null);
        }
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.deleteCourse = function(courseId, callback) {
    var courseModelCallback = function(error, jsonData) {
        if(jsonData) {
            Course.remove({ _id: jsonData._id }).then(function() {
                return callback(null, 'course_deleted');
            }).catch(function(error) {
                console.log(error);
                return callback(null, 'unknown_error');
            });
        }
        else {
            return callback(null, 'course_not_existent');
        }
    }

    this.getCourse(courseId, courseModelCallback);
}
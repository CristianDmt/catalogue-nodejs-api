"use strict";

var Database = require('../models/index');
var Mark = require('../models/MarkModel');
var Class = require('../models/Class');
var Course = require('../models/Course');
var Auth = require('../models/Auth');

var Moment = require('moment');

exports.createMark = function(instData, classId, courseId, studentId, teacherId, mark, period, type, callback) {
    var studentExistsCallback = function(error, jsonData) {
        if(jsonData) {
            var classExistsCallback = function(error, jsonData) {
                if(jsonData) {
                    var courseExistsCallback = function(error, jsonData) {
                        if(jsonData) {
                            var newMark = new Mark({
                                instId: instData._id,
                                classId: classId,
                                courseId: courseId,
                                studentId: studentId,
                                teacherId: teacherId,
                                mark: mark,
                                period: instData.currentPeriod,
                                type: type,
                                createdDate: Moment()
                            });

                            newMark.save().then(function() {
                                return callback(null, 'mark_created');
                            }).catch(function(error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            console.log(error);
                            return callback(null, 'course_not_existent');
                        }
                    }

                    Course.getCourse(courseId, courseExistsCallback);
                }
                else {
                    console.log(error);
                    return callback(null, 'class_not_existent');
                }
            }

            Class.getClass(classId, classExistsCallback);
        }
        else {
            console.log(error);
            return callback(null, 'student_not_existent');
        }
    }

    Auth.getAuth(studentId, studentExistsCallback);
}

exports.getMark = function(markId, callback) {
    Mark.findOne({ _id: markId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.deleteMark = function(markId, callback) {
    var markExistsCallback = function(error, jsonData) {
        if(jsonData) {
            Mark.remove({ _id: markId }).then(function() {
                return callback(null, 'mark_removed');
            }).catch(function(error) {
                console.log(error);
                return callback(null, null);
            });
        }
        else {
            return callback(null, 'mark_not_existent');
        }
    }

    this.getMark(markId, markExistsCallback);
}
"use strict";

var markModel = require('../models/Mark');

exports.createCourse = function(req, res) {
    if(!req.params.inst) {
        res.json({
            status: 'error',
            response: 'institution_not_set'
        });
    }

    var courseCallback = function(error, courseCreationResponse) {
        if(courseCreationResponse == 'course_created') {
            res.json({
                status: 'ok',
                response: courseCreationResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: courseCreationResponse
            });
        }
    }

    courseModel.createCourse(req.params.inst, req.body.name, courseCallback);
}

exports.listMarks = function(req, res) {
    if(!req.params.inst) {
        res.json({
            status: 'error',
            response: 'institution_not_set'
        });
    }

    markModel.list
}

exports.deleteMark = function(req, res) {
    if(!req.params.id) {
        res.json({
            status: 'error',
            response: 'id_not_set'
        });
    }

    var courseCallback = function(error, courseRemovalResponse) {
        if(courseRemovalResponse == 'course_deleted') {
            res.json({
                status: 'ok',
                response: courseRemovalResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: courseRemovalResponse
            });
        }
    }

    courseModel.deleteCourse(req.params.id, courseCallback);
}
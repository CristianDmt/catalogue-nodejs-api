"use strict";

var courseModel = require('../models/Course');

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

exports.listCourse = function(req, res) {
    if(!req.params.inst) {
        res.json({
            status: 'error',
            response: 'institution_not_set'
        });
    }

    var courseCallback = function(error, courseListResponse, courseList) {
        if(courseList) {
            res.json({
                status: 'ok',
                response: courseListResponse,
                data: courseList
            });
        }
        else {
            res.json({
                status: 'error',
                response: courseListResponse
            });
        }
    }

    courseModel.listCourse(req.params.inst, courseCallback);
}

exports.deleteCourse = function(req, res) {
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
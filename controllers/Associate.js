"use strict";

var associateModel = require('../models/Associate');

exports.demoAssoc = function(req, res) {
    associateModel.setAssocTeacherToCourse(res.locals.authId, '58c1b9b5ba75e11f781cef59', '58f369cad51ca3298497d84e', function(error, response) {
        res.json(response);
    });

    // associateModel.getAssocTeacherToCourse(res.locals.authId, '58c1b9b5ba75e11f781cef59', '58f369cad51ca3298497d84e', function(error, response) {
    //     res.json(response);
    // });

    // associateModel.removeAssocTeacherToCourse('58c1b9b5ba75e11f781cef59', '58f369cad51ca3298497d84e', function(error, response) {
    //    res.json(response);
    // });
}

exports.listStudentsByClass = function(req, res) {

}

exports.listStudentsByParent = function(req, res) {

}

exports.listClassesByMaster = function(req, res) {

}

exports.listCoursesByTeacher = function(req, res) {

}
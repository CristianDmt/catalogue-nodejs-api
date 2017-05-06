"use strict";

var associateModel = require('../models/Associate');
var institutionPermissionModel = require('../models/PermissionInstitution');

var Pager = require('../helpers/PageResponses');

exports.listStudentsByClass = function(req, res) {

}

exports.listStudentsByParent = function(req, res) {

}

exports.listClassesByMaster = function(req, res) {

}

exports.listCoursesByTeacher = function(req, res) {

}

exports.listTeachersByCourse = function(req, res) {
    var hasAccessCallback = function(error, permission) {
        if(!error && permission == 'director') {
            var requiredAssocCallback = function(error, assocResponse, jsonData) {
                if(assocResponse == 'association_teacher_to_course_retrieved') {
                    return Pager.jsonData(res, assocResponse, jsonData);
                }
                else {
                    return Pager.jsonError(res, assocResponse, jsonData);
                }
            }

            associateModel.listTeachersByCourse(req.params.inst, req.body.course, requiredAssocCallback);
        }
        else {
            Pager.accessDenied(res);
        }
    }

    institutionPermissionModel.getInstitutionPermission(res.locals.authId, req.params.inst, hasAccessCallback);
}

exports.addTeacherToCourse = function(req, res) {
    associateModel.setAssocTeacherToCourse(res.locals.authId, req.body.teacher, req.body.course, function(error, response) {
        Pager.jsonOk(res, response);
    });

    // associateModel.removeAssocTeacherToCourse('58c1b9b5ba75e11f781cef59', '58f369cad51ca3298497d84e', function(error, response) {
    //    res.json(response);
    // });
}

exports.removeTeacherFromCourse = function(req, res) {
    associateModel.removeAssocTeacherToCourse(req.body.teacher, req.body.course, function(error, response) {
        Pager.jsonOk(res, response);
    });
}

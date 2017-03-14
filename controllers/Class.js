"use strict";

var classModel = require('../models/Class');

exports.createClass = function(req, res) {
    if(!req.params.inst) {
        res.json({
            status: 'error',
            response: 'institution_not_set'
        });
    }

    var classCallback = function(error, classCreationResponse) {
        if(classCreationResponse == 'class_created') {
            res.json({
                status: 'ok',
                response: classCreationResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: classCreationResponse
            });
        }
    }

    classModel.createClass(req.params.inst, req.body.name, classCallback);
}

exports.listClass = function(req, res) {
    if(!req.params.inst) {
        res.json({
            status: 'error',
            response: 'institution_not_set'
        });
    }

    var classCallback = function(error, classListResponse, classList) {
        if(classList) {
            res.json({
                status: 'ok',
                response: classListResponse,
                data: classList
            });
        }
        else {
            res.json({
                status: 'error',
                response: classListResponse
            });
        }
    }

    classModel.listClass(req.params.inst, classCallback);
}

exports.deleteClass = function(req, res) {
    if(!req.params.id) {
        res.json({
            status: 'error',
            response: 'id_not_set'
        });
    }

    var classCallback = function(error, classRemovalResponse) {
        if(classRemovalResponse == 'class_deleted') {
            res.json({
                status: 'ok',
                response: classRemovalResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: classRemovalResponse
            });
        }
    }

    classModel.deleteClass(req.params.id, classCallback);
}
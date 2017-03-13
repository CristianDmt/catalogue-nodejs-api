"use strict";

var instModel = require('../models/Institution');

exports.createInstitution = function(req, res) {
    var instCallback = function(error, instCreationResponse) {
        if(instCreationResponse == 'institution_created') {
            res.json({
                status: 'ok',
                response: instCreationResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: instCreationResponse
            });
        }
    }

    instModel.createInstitution(req.body.name, instCallback);
}

exports.listInstitution = function(req, res) {
    var instCallback = function(error, instListResponse, instList) {
        if(instList) {
            res.json({
                status: 'ok',
                response: instListResponse,
                data: instList
            });
        }
        else {
            res.json({
                status: 'error',
                response: instListResponse
            });
        }
    }

    instModel.listInstitution(instCallback);
}

exports.deleteInstitution = function(req, res) {
    if(!req.params.id) {
        res.json({
            status: 'error',
            response: 'id_not_set'
        });
    }

    var instCallback = function(error, instRemovalResponse) {
        if(instRemovalResponse == 'institution_deleted') {
            res.json({
                status: 'ok',
                response: instRemovalResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: instRemovalResponse
            });
        }
    }

    instModel.deleteInstitution(req.params.id, instCallback);
}
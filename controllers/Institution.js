"use strict";

var instModel = require('../models/Institution');

var Pager = require('../helpers/PageResponses');

exports.createInstitution = function(req, res) {
    if(!res.locals.isAuth) {
        return Pager.accessDenied(res);
    }

    var instCallback = function(error, instCreationResponse, instId) {
        if(instCreationResponse == 'institution_created') {
            return Pager.jsonData(res, instCreationResponse, {
               id: instId
            });
        }
        else {
            return Pager.jsonError(res, instCreationResponse);
        }
    }

    instModel.createInstitution(req.body.name, res.locals.authId, instCallback);
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
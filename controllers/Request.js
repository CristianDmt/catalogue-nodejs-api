"use strict";

var Request = require('../models/Request');
var Permission = require('../models/PermissionInstitution');

var Pager = require('../helpers/PageResponses');

exports.makeRequest = function(req, res) {
    if(!res.locals.isAuth) {
        return Pager.jsonError(res, 'auth_required');
    }

    if(!req.params.inst) {
        return Pager.jsonError(res, 'institution_not_set');
    }

    var requestCallback = function(error, requestCreationResponse) {
        if(requestCreationResponse == 'request_sent') {
            return Pager.jsonOk(res, requestCreationResponse);
        }
        else {
            return Pager.jsonError(res, requestCreationResponse);
        }
    }

    Request.createRequest(req.params.inst, res.locals.authId, requestCallback);
}

exports.cancelRequest = function(req, res) {
    if(!res.locals.isAuth) {
        res.json({
            status: 'error',
            response: 'auth_required'
        });
    }

    if(!req.params.inst) {
        res.json({
            status: 'error',
            response: 'institution_not_set'
        });
    }

    var requestCallback = function(error, requestCancelResponse) {
        if(requestCancelResponse == 'request_cancelled') {
            res.json({
                status: 'ok',
                response: requestCancelResponse
            });
        }
        else {
            res.json({
                status: 'error',
                response: requestCancelResponse
            });
        }
    }

    Request.deleteRequest(req.params.inst, res.locals.authId, requestCallback);
}

exports.acceptRequest = function(req, res) {
    if(!req.params.req) {
        return Pager.jsonError(res, 'institution_not_set');
    }

    if(res.locals.isAuth) {
        var requestAccessCallback = function(error, jsonData) {
            if(jsonData) {
                var accessCallback = function(error, permission) {
                    if(permission == 'director') {
                        var requestCallback = function(error, requestResponse) {
                            if(requestResponse == 'request_accepted') {
                                return Pager.jsonOk(res, requestResponse);
                            }
                            else {
                                return Pager.jsonError(res, requestResponse);
                            }
                        }

                        Request.acceptRequest(req.params.req, requestCallback);
                    }
                    else {
                        return Pager.accessDenied(res);
                    }
                }

                Permission.getInstitutionPermission(res.locals.authId, jsonData.instId, accessCallback);
            }
            else {
                return Pager.jsonError(res, 'request_not_existent');
            }
        }

        Request.getRequestById(req.params.req, requestAccessCallback);
    }
    else {
        return Pager.jsonError(res, 'auth_required');
    }
}

exports.denyRequest = function(req, res) {
    if(!req.params.req) {
        return Pager.jsonError(res, 'institution_not_set');
    }

    if(res.locals.isAuth) {
        var requestAccessCallback = function(error, jsonData) {
            if(jsonData) {
                var accessCallback = function(error, permission) {
                    if(res.locals.globalPermissions == 'sysadmin' || permission == 'director') {
                        var requestCallback = function(error, requestResponse) {
                            if(requestResponse == 'request_accepted') {
                                return Pager.jsonOk(res, requestResponse);
                            }
                            else {
                                return Pager.jsonError(res, requestResponse);
                            }
                        }

                        Request.denyRequest(req.params.req, requestCallback);
                    }
                    else {
                        return Pager.accessDenied(res);
                    }
                }

                Permission.getInstitutionPermission(jsonData.authId, jsonData.instId, accessCallback);
            }
            else {
                return Pager.jsonError(res, 'request_not_existent');
            }
        }

        Request.getRequestById(req.params.req, requestAccessCallback);
    }
    else {
        return Pager.jsonError(res, 'auth_required');
    }
}

exports.listRequestsByInstitution = function(req, res) {
    var listRequestsCallback = function(error, response, jsonData) {
        if(jsonData) {
            Pager.jsonData(res, response, jsonData);
        }
        else {
            Pager.jsonError(res, response);
        }
    }

    Request.listRequestsByInstitution(req.params.inst, listRequestsCallback);
}
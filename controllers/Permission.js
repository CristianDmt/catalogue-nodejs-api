"use strict";

var globalPermissionModel = require('../models/Permission');
var institutionPermissionModel = require('../models/PermissionInstitution');

var Pager = require('../helpers/PageResponses');

exports.setInstitutionPermissions = function(req, res) {
    if(!res.locals.isAuth) {
        return Pager.jsonError(res, 'auth_required');
    }

    if(req.body.auth == res.locals.authId) {
        return Pager.jsonError(res, 'auth_self_permission_not_allowed');
    }

    var hasAccessCallback = function(error, permission) {
        if(!error && permission == 'director') {
            var setPermissionsCallback = function(error, jsonData) {
                if(error) {
                    return Pager.jsonError(res, jsonData);
                }
                else {
                    return Pager.jsonOk(res, jsonData);
                }
            }

            institutionPermissionModel.setInstitutionPermission(req.body.auth, req.params.inst, req.body.access, setPermissionsCallback);
        }
        else {
            Pager.accessDenied(res);
        }
    }

    institutionPermissionModel.getInstitutionPermission(res.locals.authId, req.params.inst, hasAccessCallback);
}

exports.removeInstitutionPermissions = function(req, res) {
    if(!res.locals.isAuth) {
        return Pager.jsonError(res, 'auth_required');
    }

    if(req.body.auth == res.locals.authId) {
        return Pager.jsonError(res, 'auth_self_permission_not_allowed');
    }

    var hasAccessCallback = function(error, permission) {
        if(!error && permission == 'director') {
            var removePermissionsCallback = function(error, jsonData) {
                if(error) {
                    return Pager.jsonError(res, jsonData);
                }
                else {
                    return Pager.jsonOk(res, jsonData);
                }
            }

            institutionPermissionModel.removeInstitutionPermission(req.body.auth, req.params.inst, removePermissionsCallback);
        }
        else {
            Pager.accessDenied(res);
        }
    }

    institutionPermissionModel.getInstitutionPermission(res.locals.authId, req.params.inst, hasAccessCallback);
}

exports.listAvailableAuthPermissions = function(req, res) {
    var forwardPermissionsCallback = function(error, jsonData) {
        if(error) {
            return Pager.jsonError(res, jsonData);
        }
        else {
            return Pager.jsonData(res, 'permissions_retrieved', {
                local: jsonData,
                global: res.locals.globalPermissions
            });
        }
    }

    institutionPermissionModel.getInstitutionPermissionsByAuth(res.locals.authId, forwardPermissionsCallback);
}

exports.listInstitutionPermissions = function(req, res) {
    var hasAccessCallback = function(error, permission) {
        if(!error && permission == 'director') {
            var forwardPermissionsCallback = function (error, jsonData) {
                if (error) {
                    return Pager.jsonError(res, jsonData);
                }
                else {
                    return Pager.jsonData(res, 'permissions_retrieved', jsonData);
                }
            }

            institutionPermissionModel.getInstitutionPermissions(req.params.inst, forwardPermissionsCallback);
        }
        else {
            Pager.accessDenied(res);
        }
    }

    institutionPermissionModel.getInstitutionPermission(res.locals.authId, req.params.inst, hasAccessCallback);
}
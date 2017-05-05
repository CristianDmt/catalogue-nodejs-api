"use strict";

var globalPermissionModel = require('../models/Permission');
var institutionPermissionModel = require('../models/PermissionInstitution');

var Pager = require('../helpers/PageResponses');

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
    var forwardPermissionsCallback = function(error, jsonData) {
        if(error) {
            return Pager.jsonError(res, jsonData);
        }
        else {
            return Pager.jsonData(res, 'permissions_retrieved', jsonData);
        }
    }

    institutionPermissionModel.getInstitutionPermissions(req.params.inst, forwardPermissionsCallback);
}
"use strict";

var Auth = require('../models/Auth');
var Institution = require('../models/Institution');
var InstitutionPermission = require('../models/PermissionInstitutionModel');

exports.setInstitutionPermission = function(authId, instId, access, callback){
    if(
        access.toLowerCase() != 'student'
        && access.toLowerCase() != 'parent'
        && access.toLowerCase() != 'teacher'
        && access.toLowerCase() != 'director'
    ) {
        return callback(null, 'unrecognised_institution_access');
    }

    var authExistsCallback = function(error, jsonData) {
        if(jsonData) {
            var setPermissionCallback = function(error, jsonData) {
                if(jsonData) {
                    var permission = new InstitutionPermission({
                        authId: authId,
                        instId: instId,
                        access: access.toUpperCase()
                    });

                    InstitutionPermission.count({authId: authId, instId: instId}).then(function (count) {
                        if (count > 0) {
                            InstitutionPermission.update({
                                authId: authId,
                                instId: instId
                            }, {$set: {access: access}}).then(function () {
                                return callback(null, 'institution_access_updated');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            permission.save().then(function () {
                                return callback(null, 'institution_access_set');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                        return callback(null, 'unknown_error');
                    });
                }
                else {
                    return callback(null, 'institution_not_existent');
                }
            }

            Institution.getInstitution(instId, setPermissionCallback);
        }
        else {
            return callback(null, 'auth_not_existent');
        }
    }

    Auth.getAuth(authId, authExistsCallback);
}

exports.getInstitutionPermission = function(authId, instId, callback) {
    var getPermissionCallback = function(error, jsonData) {
        if(jsonData) {
            InstitutionPermission.findOne({ authId: jsonData._id, instId: instId }).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData.access.toLowerCase());
                }
                else {
                    return callback(true, 'auth_access_not_set');
                }
            }).catch(function(error) {
                console.log(error);

                return callback(true, 'unknown_error');
            });
        }
        else {
            return callback(true, 'auth_not_existent');
        }
    }

    Auth.getAuth(authId, getPermissionCallback);
}
"use strict";

var Auth = require('../models/Auth');
var GlobalPermission = require('../models/PermissionGlobalModel');

exports.setPermission = function(authId, access, callback){
    if(access.toLowerCase() != 'normal' && access.toLowerCase() != 'sysadmin') {
        return callback(null, 'unrecognised_global_access');
    }

    var setPermissionCallback = function(error, jsonData) {
        if(jsonData) {
            var permission = new GlobalPermission({
                authId: authId,
                access: access.toUpperCase()
            });

            GlobalPermission.count({ authId: authId }).then(function (count) {
                if (count > 0) {
                    GlobalPermission.update({ authId: authId }, {$set: {access: access}}).then(function () {
                        return callback(null, 'global_access_updated');
                    }).catch(function (error) {
                        console.log(error);
                        return callback(null, 'unknown_error');
                    });
                }
                else {
                    permission.save().then(function () {
                        return callback(null, 'global_access_set');
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
            return callback(null, 'auth_not_existent');
        }
    }

    Auth.getAuth(authId, setPermissionCallback);
}

exports.getPermission = function(authId, callback) {
    var getPermissionCallback = function(error, jsonData) {
        if(jsonData) {
            GlobalPermission.findOne({ authId: jsonData._id }).then(function(jsonData) {
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
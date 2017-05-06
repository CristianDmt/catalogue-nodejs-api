"use strict";

var Auth = require('../models/Auth');
var Institution = require('../models/Institution');
var InstitutionPermission = require('../models/PermissionInstitutionModel');

exports.setInstitutionPermission = function(authId, instId, access, callback) {
    if(
        access.toLowerCase() != 'new'
        && access.toLowerCase() != 'parent'
        && access.toLowerCase() != 'student'
        && access.toLowerCase() != 'teacher'
        && access.toLowerCase() != 'master'
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

                    InstitutionPermission.count({ authId: authId, instId: instId }).then(function (count) {
                        if (count > 0) {
                            InstitutionPermission.update({
                                authId: authId,
                                instId: instId
                            }, { $set: { access: access.toUpperCase() } }).then(function () {
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

exports.removeInstitutionPermission = function(authId, instId, callback) {
    var getPermissionCallback = function(error, jsonData) {
        if(jsonData) {
            InstitutionPermission.remove({ authId: jsonData._id, instId: instId }).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, 'auth_access_revoked');
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

exports.getInstitutionPermissionsByAuth = function(authId, callback) {
    var getPermissionCallback = function(error, jsonData) {
        if(jsonData) {
            /* InstitutionPermission.find({ authId: jsonData._id }, 'instId access').then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData);
                }
                else {
                    return callback(true, 'auth_access_not_set');
                }
            }).catch(function(error) {
                console.log(error);

                return callback(true, 'unknown_error');
            }); */

            InstitutionPermission.aggregate([
                { $match: { "authId": authId } },
                {
                    $lookup: {
                        'from': 'Institutions',
                        'localField': 'instId',
                        'foreignField': '_strId',
                        'as': 'inst'
                    }
                },
                { $unwind: "$inst" },
                { $project: { instId: "$instId", instName: "$inst.name", access: "$access" } }
            ]).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData);
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

exports.getInstitutionPermissions = function(instId, callback) {
    var getInstitutionCallback = function(error, jsonData) {
        if(jsonData) {
            InstitutionPermission.aggregate([
                { $match: { "instId": instId } },
                {
                    $lookup: {
                        'from': 'AuthSettings',
                        'localField': 'authId',
                        'foreignField': 'authId',
                        'as': 'auth'
                    }
                },
                { $unwind: "$auth" },
                { $project: { authId: "$authId", authName: "$auth.name", access: "$access" } }
            ]).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData);
                }
                else {
                    return callback(true, 'institution_access_not_set');
                }
            }).catch(function(error) {
                console.log(error);

                return callback(true, 'unknown_error');
            });
        }
        else {
            return callback(true, 'institution_not_existent');
        }
    }

    Institution.getInstitution(instId, getInstitutionCallback);
}

exports.getInstitutionAllTeacherPermissions = function(instId, callback) {
    var getInstitutionCallback = function(error, jsonData) {
        if(jsonData) {
            InstitutionPermission.aggregate([
                { $match: { "instId": instId, access: { $in: [ 'TEACHER', 'MASTER', 'DIRECTOR' ]} } },
                {
                    $lookup: {
                        'from': 'AuthSettings',
                        'localField': 'authId',
                        'foreignField': 'authId',
                        'as': 'auth'
                    }
                },
                { $unwind: "$auth" },
                { $project: { authId: "$authId", authName: "$auth.name" } }
            ]).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData);
                }
                else {
                    return callback(true, 'institution_access_not_set');
                }
            }).catch(function(error) {
                console.log(error);

                return callback(true, 'unknown_error');
            });
        }
        else {
            return callback(true, 'institution_not_existent');
        }
    }

    Institution.getInstitution(instId, getInstitutionCallback);
}

exports.getInstitutionAllStudentPermissions = function(instId, callback) {
    var getInstitutionCallback = function(error, jsonData) {
        if(jsonData) {
            InstitutionPermission.aggregate([
                { $match: { "instId": instId, access: 'STUDENT' } },
                {
                    $lookup: {
                        'from': 'AuthSettings',
                        'localField': 'authId',
                        'foreignField': 'authId',
                        'as': 'auth'
                    }
                },
                { $unwind: "$auth" },
                { $project: { authId: "$authId", authName: "$auth.name" } }
            ]).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData);
                }
                else {
                    return callback(true, 'institution_access_not_set');
                }
            }).catch(function(error) {
                console.log(error);

                return callback(true, 'unknown_error');
            });
        }
        else {
            return callback(true, 'institution_not_existent');
        }
    }

    Institution.getInstitution(instId, getInstitutionCallback);
}
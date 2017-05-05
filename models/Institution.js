"use strict";

var Database = require('../models/index');
var Inst = require('../models/InstitutionModel');
var InstitutionSettings = require('../models/InstitutionSettingsModel');
var Permission = require('../models/PermissionInstitution');

var Moment = require('moment');

exports.createInstitution = function(instName, authId, callback) {
    if(typeof(instName) == 'undefined' || instName.length < 3 || instName.length > 100) {
        callback(null, 'institution_invalid_name', null);
    }

    var newInst = new Inst({
        name: instName,
        createdDate: Moment()
    });

    newInst.save().then(function(jsonData) {
        // Async set the institution self.id for $lookup.
        newInst._strId = jsonData._id;
        newInst.save();

        // Async create the institution settings.
        var newInstitutionSettings = new InstitutionSettings({
            instId: jsonData._id
        });

        newInstitutionSettings.save();

        // Async give director rights to the creator.
        Permission.setInstitutionPermission(authId, jsonData._id, 'director', function(error, response) {});

        return callback(null, 'institution_created', jsonData._id);
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error', null);
    });
}

exports.listInstitution = function(callback) {
    Inst.find({}, 'name').then(function(jsonData) {
        return callback(null, 'institution_list_retrieved', jsonData);
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error', null);
    });
}

exports.getInstitution = function(instId, callback) {
    Inst.findOne({ _id: instId }, {}).then(function(jsonData) {
        if(jsonData) {
            return callback(null, jsonData);
        }
        else {
            return callback(null, null);
        }
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.getInstitutionSettings = function(instId, callback) {
    InstitutionSettings.findOne({ instId: instId }, {}).then(function(jsonData) {
        if(jsonData) {
            return callback(null, jsonData);
        }
        else {
            return callback(null, null);
        }
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.updateInstitutionSettings = function(instId, notationSystem, periodsCount, currentPeriod, acceptRequests, callback) {
    var instExistsCallback = function(error, jsonData) {
        if(jsonData) {
            InstitutionSettings.update({
                instId: instId
            }, {
                $set: {
                    notationSystem: notationSystem,
                    periodsCount: periodsCount,
                    currentPeriod: currentPeriod,
                    acceptRequests: acceptRequests
                }
            }).then(function () {
                return callback(null, 'institution_settings_updated');
            }).catch(function (error) {
                console.log(error);
                return callback(null, 'unknown_error');
            });
        }
        else {
            return callback(null, 'institution_not_existent');
        }
    }

    this.getInstitution(instId, instExistsCallback);
}

exports.deleteInstitution = function(instId, callback) {
    var instModelCallback = function(error, jsonData) {
        if(jsonData) {
            Inst.remove({ _id: jsonData._id }).then(function() {
                // Async remove the institution settings if any.
                InstitutionSettings.remove({ instId: jsonData._id });
                
                return callback(null, 'institution_deleted');
            }).catch(function(error) {
                console.log(error);
                return callback(null, 'unknown_error');
            });
        }
        else {
            return callback(null, 'institution_not_existent');
        }
    }

    this.getInstitution(instId, instModelCallback);
}
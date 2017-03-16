"use strict";

var Database = require('../models/index');
var Inst = require('../models/InstitutionModel');

var Moment = require('moment');

exports.createInstitution = function(instName, callback) {
    if(typeof(instName) == 'undefined' || instName.length < 3 || instName.length > 100) {
        callback(null, 'institution_invalid_name');
    }

    var newInst = new Inst({
        name: instName,
        createdDate: Moment()
    });

    newInst.save().then(function(success) {
        return callback(null, 'institution_created');
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error');
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

exports.deleteInstitution = function(instId, callback) {
    var instModelCallback = function(error, jsonData) {
        if(jsonData) {
            Inst.remove({ _id: jsonData._id }).then(function() {
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
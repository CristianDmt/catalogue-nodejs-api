"use strict";

var Database = require('../models/index');
var Class = require('../models/ClassModel');
var Inst = require('../models/Institution');

var Moment = require('moment');

exports.createClass = function(instId, className, callback) {
    if(typeof(className) == 'undefined' || className.length < 3 || className.length > 100) {
        return callback(null, 'class_invalid_name');
    }

    var createClassCallback = function(error, jsonData) {
        if(jsonData) {
            var newClass = new Class({
                instId: instId,
                name: className,
                createdDate: Moment()
            });

            newClass.save().then(function(jsonData) {
                newClass._strId = jsonData._id;
                newClass.save();

                return callback(null, 'class_created');
            }).catch(function (error) {
                console.log(error);
                return callback(null, 'unknown_error');
            });
        }
        else {
            return callback(null, 'institution_not_existent');
        }
    }

    Inst.getInstitution(instId, createClassCallback);
}

exports.listClass = function(instId, callback) {
    Class.find({ instId: instId }, 'name createdDate').then(function(jsonData) {
        if(jsonData) {
            return callback(null, 'class_list_retrieved', jsonData);
        }
        else {
            return callback(null, 'institution_not_existent', jsonData);
        }
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error', null);
    });
}

exports.getClass = function(classId, callback) {
    Class.findOne({ _id: classId }, {}).then(function(jsonData) {
        if(jsonData) {
            callback(null, jsonData);
        }
        else {
            callback(null, null);
        }
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.deleteClass = function(classId, callback) {
    var classModelCallback = function(error, jsonData) {
        if(jsonData) {
            Class.remove({ _id: jsonData._id }).then(function() {
                return callback(null, 'class_deleted');
            }).catch(function(error) {
                console.log(error);
                return callback(null, 'unknown_error');
            });
        }
        else {
            return callback(null, 'class_not_existent');
        }
    }

    this.getClass(classId, classModelCallback);
}
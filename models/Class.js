"use strict";

var Database = require('../models/index');
var Class = require('../models/ClassModel');

var Moment = require('moment');

exports.createClass = function(instId, className, callback) {
    if(typeof(className) == 'undefined' || className.length < 3 || className.length > 100) {
        callback(null, 'institution_invalid_name');
    }

    var newClass = new Class({
        instId: instId,
        name: className,
        createdDate: Moment()
    });

    newClass.save().then(function(success) {
        return callback(null, 'class_created');
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error');
    });
}

exports.listClass = function(instId, callback) {
    Class.find({ instId: instId }, 'name').then(function(jsonData) {
        return callback(null, 'class_list_retrieved', jsonData);
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
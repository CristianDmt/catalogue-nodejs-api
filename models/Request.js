"use strict";

var Database = require('../models/index');
var Request = require('../models/RequestModel');
var InstPermission = require('../models/PermissionInstitution');
var Auth = require('../models/Auth');
var Inst = require('../models/Institution');

var Moment = require('moment');

exports.createRequest = function(instId, authId, callback) {
    var duplicateRequestCallback = function(error, jsonData) {
        if(jsonData) {
            return callback(null, 'request_duplicate');
        }
        else {
            var createRequestCallback = function (error, jsonData) {
                if (jsonData) {
                    var processRequestCallback = function (error, jsonData) {
                        if (jsonData) {
                            var newRequest = new Request({
                                instId: instId,
                                authId: authId,
                                createdDate: Moment()
                            });

                            newRequest.save().then(function (success) {
                                return callback(null, 'request_sent');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            return callback(null, 'institution_not_existent');
                        }
                    }

                    Inst.getInstitution(instId, processRequestCallback);
                }
                else {
                    return callback(null, 'auth_not_existent');
                }
            }

            Auth.getAuth(authId, createRequestCallback);
        }
    }

    this.getRequest(instId, authId, duplicateRequestCallback);
}

exports.getRequest = function(instId, authId, callback) {
    Request.findOne({ instId: instId, authId: authId, processed: false }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);

        return callback(null, null);
    });
}

exports.getRequestById = function(requestId, callback) {
    Request.findOne({ _id: requestId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);

        return callback(null, null);
    });
}

exports.deleteRequest = function(instId, authId, callback) {
    var cancelRequestCallback = function(error, jsonData) {
        if(jsonData) {
            Request.remove({ instId: jsonData.instId, authId: jsonData.authId }).then(function() {
                return callback(null, 'request_cancelled');
            });
        }
        else {
            return callback(null, 'request_not_existent');
        }
    }

    this.getRequest(instId, authId, cancelRequestCallback);
}

exports.listRequests = function(callback) {
    Request.find({}).then(function(jsonData) {
        return callback(null, 'requests_list_retrieved', jsonData);
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error', null);
    });
}

exports.listRequestsByInstitution = function(instId, callback) {
    Request.aggregate([
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
        { $project: { authId: "$authId", authName: "$auth.name" } }]).then(function(jsonData) {
        return callback(null, 'requests_list_retrieved', jsonData);
    }).catch(function(error) {
        console.log(error);
        return callback(null, 'unknown_error', null);
    });
}

exports.acceptRequest = function(requestId, callback) {
    var processRequestCallback = function(error, jsonData) {
        if(jsonData && jsonData.processed) {
            return callback(null, 'request_already_processed');
        }
        else if(jsonData) {
            var markProcessedCallback = function(error, jsonResponse) {
                if(jsonResponse == 'institution_access_set' || jsonResponse == 'institution_access_updated') {
                    Request.update({ _id: requestId }, { $set: { processed: true }}).then(function () {
                        Request.remove({ _id: requestId }).then(function() {

                        });
                        return callback(null, 'request_accepted');
                    }).catch(function (error) {
                        console.log(error);
                        return callback(null, 'unknown_error');
                    });
                }
                else {
                    return callback(null, 'request_processing_failed');
                }
            }

            InstPermission.setInstitutionPermission(jsonData.authId, jsonData.instId, 'new', markProcessedCallback);
        }
        else {
            return callback(null, 'request_not_existent');
        }
    }

    this.getRequestById(requestId, processRequestCallback);
}

exports.denyRequest = function(requestId, callback) {
    var processRequestCallback = function(error, jsonData) {
        if(jsonData && jsonData.processed) {
            return callback(null, 'request_already_processed');
        }
        else if(jsonData) {
            Request.update({ _id: requestId }, { $set: { processed: true } }).then(function () {
                Request.remove({ _id: requestId }).then(function() {

                });
                return callback(null, 'request_denied');
            }).catch(function (error) {
                console.log(error);
                return callback(null, 'unknown_error');
            });
        }
        else {
            return callback(null, 'request_not_existent');
        }
    }

    this.getRequestById(requestId, processRequestCallback);
}
"use strict";

var authModel = require('../models/Auth');

exports.createAuth = function(req, res) {
    var authCallback = function(error, authCreationResponse) {
        if (authCreationResponse == 'account_created') {
            res.json({status: 'success'});
        }
        else {
            res.json({
                status: 'error',
                error: authCreationResponse
            });
        }
    }

    authModel.createAuth(req.body.username, req.body.password, req, authCallback);
}

exports.validateKey = function(req, res) {
    res.json({ hey: "hoo" });
}
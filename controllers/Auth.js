"use strict";

var authModel = require('../models/Auth');

exports.createAuth = function(req, res) {
    var authCallback = function(error, authCreationResponse) {
        if (authCreationResponse == 'account_created') {
            res.json({
                status: 'ok',
                response: authCreationResponse
            });
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

exports.requestToken = function(req, res) {
    var authCallback = function(error, authRequestResponse, authToken) {
        if(authRequestResponse == 'authorised') {
            res.json({
                status: 'ok',
                response: authRequestResponse,
                token: authToken
            });
        }
        else {
            res.json({
                status: 'error',
                error: authRequestResponse
            });
        }
    }

    authModel.requestToken(req.body.username, req.body.password, req, authCallback);
}

exports.validateKey = function(req, res) {
    res.json({ hey: "hoo" });
}
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
        if(authRequestResponse == 'auth_authorised') {
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

exports.validateToken = function(req, res) {
    if(!req.params.token) {
        res.json({
            status: 'error',
            response: 'token_not_set'
        });
    }

    var authCallback = function(error, tokenState) {
        if(tokenState == 'token_valid') {
            res.json({
                status: 'ok',
                response: tokenState
            });
        }
        else {
            res.json({
                status: 'error',
                response: tokenState
            });
        }
    }

    authModel.validateToken(req.params.token, req, authCallback);
}
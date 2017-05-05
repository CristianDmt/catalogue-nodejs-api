"use strict";

var authModel = require('../models/Auth');

var Pager = require('../helpers/PageResponses');

exports.createAuth = function(req, res) {
    var authCallback = function(error, authCreationResponse) {
        if (authCreationResponse == 'auth_created') {
            return Pager.jsonOk(res, authCreationResponse);
        }
        else {
            return Pager.jsonError(res, authCreationResponse);
        }
    }

    authModel.createAuth(req.body.username, req.body.password, req.body.name, req, authCallback);
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
            return Pager.jsonError(res, authRequestResponse);
        }
    }

    authModel.requestToken(req.body.username, req.body.password, req, authCallback);
}

exports.validateToken = function(req, res) {
    if(!req.params.token) {
        return Pager.jsonError(res, 'token_not_set');
    }

    var authCallback = function(error, tokenState) {
        if(tokenState == 'token_valid') {
            return Pager.jsonOk(res, tokenState);
        }
        else {
            return Pager.jsonError(res, tokenState);
        }
    }

    authModel.validateToken(req.params.token, req, authCallback);
}
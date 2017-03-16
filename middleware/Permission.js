"use strict";

var Auth = require('../models/Auth');
var Permission = require('../models/Permission');

exports.retrieveGlobalPermission = function(req, res, next) {
    Auth.validateToken(req.params.token, req, function(error, isAuth, authId) {
        if(isAuth == 'token_valid') {
            res.locals.isAuth = true;

            Permission.getPermission(authId, function(error, globalPermission) {
                if(error) {
                    res.locals.globalPermissions = null;
                }
                else {
                    res.locals.globalPermissions = globalPermission;
                }

                return next();
            });
        }
        else {
            res.locals.isAuth = false;

            return next();
        }
    });
}

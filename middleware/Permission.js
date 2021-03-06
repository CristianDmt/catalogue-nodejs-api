"use strict";

var Auth = require('../models/Auth');
var Permission = require('../models/Permission');
var Pager = require('../helpers/PageResponses');

exports.retrieveGlobalPermission = function(req, res, next) {
    Auth.validateToken(req.query.token, req, function(error, isAuth, authId) {
        if(isAuth == 'token_valid') {
            res.locals.isAuth = true;
            res.locals.authId = authId;

            Permission.getPermission(authId, function permissionCallback(error, globalPermission) {
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
            // return Pager.accessDenied(res);

            return next();
        }
    });
}

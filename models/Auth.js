"use strict";

var Database = require('../models/index');
var Auth = require('../models/AuthModel');
var IP = require('ipware')().get_ip;

exports.createAuth = function(authUsername, authPassword, authRequest, callback) {
    // Validate the Username and Password.
    if(authUsername.length < 6 || authUsername.length > 16) {
        return 'invalid_username';
    }

    if(authPassword.length < 6) {
        return 'invalid_password';
    }

    // Check for Duplicates.
    Auth.count({ username: authUsername }).then(function(accountCount) {
        if(accountCount == 0) {
            var newAccount = new Auth({
                username: authUsername,
                password: authPassword,
                registerDate: Date.now(),
                registerIP: IP(authRequest).clientIp
            });

            newAccount.save().then(function() {
                return callback(null, 'account_created');
            }).catch(function(error) {
                return callback(error, 'unknown_error');
            });
        }
        else {
            return callback(null, 'taken_username');
        }
    });
}
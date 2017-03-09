"use strict";

var Database = require('../models/index');
var Auth = require('../models/AuthModel');
var AuthToken = require('../models/AuthTokenModel');

var Token = require('../helpers/TokenMaker');

var Moment = require('moment');
var Hash = require('js-sha512');
var IP = require('ipware')().get_ip;

exports.createAuth = function(authUsername, authPassword, authRequest, callback) {
    // Validate the Username and Password.
    if(typeof(authUsername) == 'undefined' || authUsername.length < 6 || authUsername.length > 16) {
        return callback(null, 'invalid_username');
    }

    if(typeof(authPassword) == 'undefined' || authPassword.length < 6) {
        return callback(null, 'invalid_password');
    }

    // Check for Duplicates.
    Auth.count({ username: authUsername }).then(function(accountCount) {
        if(accountCount == 0) {
            // Proceed with hashing the password.
            var passwordSalt = Token.generateToken(64);
            var passwordHash = Hash.sha512(authPassword + '$' + passwordSalt);

            var newAccount = new Auth({
                username: authUsername,
                password: passwordHash,
                passwordSalt: passwordSalt,
                registerDate: Moment(),
                registerIP: IP(authRequest).clientIp
            });

            newAccount.save().then(function() {
                return callback(null, 'account_created');
            }).catch(function(error) {
                console.log(error);

                return callback(error, 'unknown_error');
            });
        }
        else {
            return callback(null, 'taken_username');
        }
    });
}

exports.getAuthSalt = function(authUsername, callback) {
    Auth.findOne({ username: authUsername }, 'passwordSalt').then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);

        return callback(error, null);
    });
}

exports.matchAuth = function(authUsername, authPassword, callback) {
    var passwordSaltCallback = function(error, jsonData) {
        if(jsonData) {
            var passwordHash = Hash.sha512(authPassword + '$' + jsonData.passwordSalt);
            Auth.findOne({username: authUsername, password: passwordHash}, {}).then(function(jsonData) {
                if(jsonData) {
                    return callback(null, jsonData, true);
                }
                else {
                    return callback(null, null, false);
                }
            }).catch(function(error) {
                console.log(error);

                return callback(error, null, false);
            });
        }
        else {
            return callback(null, true);
        }
    }

    this.getAuthSalt(authUsername, passwordSaltCallback);
}

exports.requestToken = function(authUsername, authPassword, authRequest, callback) {
    var matchAuthCallback = function(error, jsonData, matchResponse) {
        // Match response is true. We can now create a key and provide it to the client.
        if(matchResponse == true) {
            var authToken = Token.generateToken(64);
            var newToken = new AuthToken({
                authId: jsonData._id,
                token: authToken,
                restrictedIP: IP(authRequest).clientIp,
                restrictedAgent: authRequest.headers['user-agent'],
                createdAt: Moment(),
                expiresAt: Moment().add(1, 'hours')
            });

            // Quick garbage collection. Cleaning up all the previous
            // keys in order to prevent previous authentications.
            AuthToken.remove({
                restrictedIP: IP(authRequest).clientIp,
                restrictedAgent: authRequest.headers['user-agent']
            }).then(function() { }).catch(function(error) { console.error(error); });

            newToken.save().then(function() {
                return callback(null, 'auth_authorised', authToken);
            }).catch(function(error) {
                console.log(error);

                return callback(null, 'auth_unauthorised', null);
            });
        }
        else if(matchResponse == false) {
            return callback(null, 'auth_unauthorised', null);
        }
        else {
            console.log(error);

            return callback(null, 'unknown_error', null);
        }
    }

    this.matchAuth(authUsername, authPassword, matchAuthCallback);
}

exports.validateToken = function(token, authRequest, callback) {
    AuthToken.findOne({ token: token }, {}).then(function(jsonData) {
        // We found the token. Excluding the invalid case.
        if(jsonData) {
            // We excluded the token theft possibility.
            if (IP(authRequest).clientIp == jsonData.restrictedIP &&
                authRequest.headers['user-agent'] == jsonData.restrictedAgent) {
                var thisDate = Moment();
                var expireAt = Moment(jsonData.expiresAt);
                // We excluded the token expired possibility.
                // Return token_valid flag.
                if(thisDate < expireAt) {
                    return callback(null, 'token_valid');
                }
                else {
                    // Remove the token for gargabe collection.
                    AuthToken.remove({ token: token }).then(function() {
                        return callback(null, 'token_expired');
                    }).catch(function(error) {
                        console.log(error);

                        return callback(null, 'unknown_error');
                    });
                }
            }
            else {
                // Removed the token for safety reasons.
                AuthToken.remove({ token: token }).then(function() {
                    return callback(null, 'token_theft');
                }).catch(function(error) {
                    console.log(error);

                    return callback(null, 'unknown_error');
                });
            }
        }
        else {
            return callback(null, 'token_invalid');
        }
    }).catch(function(error) {
       console.log(error);

       return callback(null, 'unknown_error');
    });
}
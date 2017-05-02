"use strict";

var Database = require('../models/index');
var Auth = require('../models/AuthModel');
var AuthToken = require('../models/AuthTokenModel');
var Permission = require('../models/Permission');

var Token = require('../helpers/TokenMaker');

var Moment = require('moment');
var Hash = require('js-sha512');
var IP = require('ipware')().get_ip;

exports.createAuth = function(authUsername, authPassword, authRequest, callback) {
    // Validate the Username and Password.
    if(typeof(authUsername) == 'undefined' || authUsername.length < 6 || authUsername.length > 16) {
        return callback(null, 'auth_invalid_username');
    }

    if(typeof(authPassword) == 'undefined' || authPassword.length < 6) {
        return callback(null, 'auth_invalid_password');
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

            newAccount.save().then(function(newAccount) {
                Permission.setPermission(newAccount._id, 'normal', function authSetPermissionCallback(error, permResponse) {
                    if(permResponse == 'global_access_set') {
                        return callback(null, 'auth_created');
                    }
                    else {
                        return callback(null, 'auth_created_no_permission');
                    }
                });
            }).catch(function(error) {
                console.log(error);

                return callback(error, 'unknown_error');
            });
        }
        else {
            return callback(null, 'auth_taken_username');
        }
    });
}

exports.getAuth = function(authId, callback) {
    Auth.findOne({ _id: authId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);

        return callback(null, null);
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
            return callback(null, null, false);
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
                expiresAt: Moment().add(6, 'hours')
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
                    return callback(null, 'token_valid', jsonData.authId);
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
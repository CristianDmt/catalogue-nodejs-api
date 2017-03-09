"use strict";

exports.generateToken = function(tokenSize) {
    var tokenAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var generatedToken = '';

    for(var i = 0; i < tokenSize; i++) {
        generatedToken += tokenAllowedChars.charAt(Math.floor(Math.random() * tokenAllowedChars.length));
    }

    return generatedToken;
}
"use strict";

exports.accessDenied = function() {
    return res.json({
        status: 'error',
        response: 'access_denied'
    });
}
"use strict";

exports.accessDenied = function(res) {
    return res.json({
        status: 'error',
        response: 'access_denied'
    });
}

exports.jsonOk = function(res, str) {
    return res.json({
        status: 'ok',
        response: str
    });
}

exports.jsonData = function(res, str, data) {
    return res.json({
        status: 'ok',
        response: str,
        data: data
    });
}

exports.jsonError = function(res, error) {
    return res.json({
        status: 'error',
        response: error
    });
}
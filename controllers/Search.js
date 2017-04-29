"use strict";

// var searchModel = require('../models/Search');

var Pager = require('../helpers/PageResponses');

exports.querySearch = function(req, res) {
   Pager.jsonData(res, 'query_executed', [
    { name: 'test' },
    { name: 'you' }
   ]);
}
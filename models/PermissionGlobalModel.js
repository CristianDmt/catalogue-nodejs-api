"use strict";

var Database = require('../models/index');

console.log("Compiling Permission Global Schema...");
var permGlobalSchema = new Database.Schema({
        authId: String,
        access: { type: String, default: 'NORMAL' }
    }, {
        versionKey: false
    }
);

console.log("Exporting Permission Global Model...");
var permGlobalModel = Database.model('PermissionGlobal', permGlobalSchema, 'PermissionGlobals');

module.exports = permGlobalModel;
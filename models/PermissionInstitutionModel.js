"use strict";

var Database = require('../models/index');

console.log("Compiling Permission Inst Schema...");
var permInstSchema = new Database.Schema({
        authId: String,
        instId: String,
        access: { type: String, default: 'student' }
    }, {
        versionKey: false
    }
);

console.log("Exporting Permission Inst Model...");
var permInstModel = Database.model('PermissionInstitution', permInstSchema, 'PermissionInstitutions');

module.exports = permInstModel;
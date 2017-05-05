"use strict";

var Database = require('../models/index');

console.log("Compiling Authentication Schema...");
var authSettingsSchema = new Database.Schema({
        authId: { type: String, required: true },
        name: { type: String, default: "" },
        enableNotifications: { type: Boolean, default: true }
    }, {
        versionKey: false
    }
);

console.log("Exporting Authentication Model...");
var authSettingsModel = Database.model('AuthSetting', authSettingsSchema, 'AuthSettings');

module.exports = authSettingsModel;
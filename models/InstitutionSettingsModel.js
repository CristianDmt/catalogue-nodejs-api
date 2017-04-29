"use strict";

var Database = require('../models/index');

console.log("Compiling Institution Settings Schema...");
var instSettingsSchema = new Database.Schema({
        instId: { type: String, required: true },
        notationSystem: { type: String, default: 'eu' },
        periodsCount: { type: Number, default: 1 },
        currentPeriod: { type: Number, default: 1 },
        acceptRequests: { type: Boolean, default: true }
    }, {
        versionKey: false
    }
);

console.log("Exporting Institution Settings Model...");
var instSettingsModel = Database.model('InstitutionSetting', instSettingsSchema, 'InstitutionSettings');

module.exports = instSettingsModel;
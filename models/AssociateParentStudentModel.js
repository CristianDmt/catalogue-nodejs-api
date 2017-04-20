"use strict";

var Database = require('../models/index');

console.log("Compiling Association :: Parent -> Student Schema...");
var associateParentStudentSchema = new Database.Schema({
        instId: { type: String, required: true },
        parentId: { type: String, required: true },
        studentId: { type: String, required: true },
        assocDate: { type: Date, default: Date.now() },
        assocBy: String
    }, {
        versionKey: false
    }
);

console.log("Exporting Association :: Parent -> Student Model...");
var associateParentStudentModel = Database.model('AssociateParentStudent', associateParentStudentSchema, 'AssociateParentStudents');

module.exports = associateParentStudentModel;
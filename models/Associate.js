"use strict";

var Database = require('../models/index');
var Inst = require('../models/Institution');
var Class = require('../models/Class');
var Course = require('../models/Course');
var Auth = require('../models/Auth');
var AssocCourseToClass = require('../models/AssociateCourseClassModel');
var AssocMasterToClass = require('../models/AssociateMasterClassModel');
var AssocTeacherToCourse = require('../models/AssociateTeacherCourseModel');
var AssocParentToStudent = require('../models/AssociateParentStudentModel');

var Moment = require('moment');

exports.setAssocTeacherToCourse = function(originId, authId, courseId, callback) {
    var duplicateCheckCallback = function(error, jsonData) {
        if(jsonData) {
            return callback(null, 'association_already_existent');
        }
        else {
            var matchAuthCallback = function (error, jsonData) {
                if (jsonData) {
                    var matchCourseCallback = function (error, jsonData) {
                        if (jsonData) {
                            var newAssoc = new AssocTeacherToCourse({
                                instId: jsonData.instId,
                                teacherId: authId,
                                courseId: courseId,
                                assocDate: Moment(),
                                assocBy: originId
                            });

                            newAssoc.save().then(function () {
                                return callback(null, 'associated_teacher_to_course');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            console.log(error);
                            return callback(null, 'course_not_existent');
                        }
                    }

                    Course.getCourse(courseId, matchCourseCallback);
                }
                else {
                    console.log(error);
                    return callback(null, 'auth_not_existent');
                }
            }

            Auth.getAuth(authId, matchAuthCallback);
        }
    }

    this.getAssocTeacherToCourse(authId, courseId, duplicateCheckCallback);
}

exports.getAssocTeacherToCourse = function(authId, courseId, callback) {
    AssocTeacherToCourse.findOne({ teacherId: authId, courseId: courseId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.removeAssocTeacherToCourse = function(authId, courseId, callback) {
    var associationExistsCallback = function(error, jsonData) {
        if(jsonData) {
            AssocTeacherToCourse.remove({ teacherId: authId, courseId: courseId }).then(function() {
                return callback(null, 'association_removed');
            }).catch(function(error) {
                console.log(error);
                return callback(null, null);
            });
        }
        else {
            return callback(null, 'association_not_existent');
        }
    }

    this.getAssocTeacherToCourse(authId, courseId, associationExistsCallback);
}

exports.setAssocCourseToClass = function(originId, courseId, classId, callback) {
    var duplicateCheckCallback = function(error, jsonData) {
        if(jsonData) {
            return callback(null, 'association_already_existent');
        }
        else {
            var matchCourseCallback = function (error, jsonData) {
                if (jsonData) {
                    var matchClassCallback = function (error, jsonData) {
                        if (jsonData) {
                            var newAssoc = new AssocCourseToClass({
                                instId: jsonData.instId,
                                courseId: courseId,
                                classId: classId,
                                assocDate: Moment(),
                                assocBy: originId
                            });

                            newAssoc.save().then(function () {
                                return callback(null, 'associated_course_to_class');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            console.log(error);
                            return callback(null, 'course_not_existent');
                        }
                    }

                    Class.getClass(classId, matchClassCallback);
                }
                else {
                    console.log(error);
                    return callback(null, 'auth_not_existent');
                }
            }

            Course.getCourse(courseId, matchCourseCallback);
        }
    }

    this.getAssocCourseToClass(courseId, classId, duplicateCheckCallback);
}

exports.getAssocCourseToClass = function(courseId, classId, callback) {
    AssocCourseToClass.findOne({ courseId: courseId, classId: classId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.removeAssocCourseToClass = function(courseId, classId, callback) {
    var associationExistsCallback = function(error, jsonData) {
        if(jsonData) {
            AssocCourseToClass.remove({ courseId: courseId, classId: classId }).then(function() {
                return callback(null, 'association_removed');
            }).catch(function(error) {
                console.log(error);
                return callback(null, null);
            });
        }
        else {
            return callback(null, 'association_not_existent');
        }
    }

    this.getAssocCourseToClass(courseId, classId, associationExistsCallback);
}

exports.setAssocMasterToClass = function(originId, authId, classId, callback) {
    var duplicateCheckCallback = function(error, jsonData) {
        if(jsonData) {
            return callback(null, 'association_already_existent');
        }
        else {
            var matchAuthCallback = function (error, jsonData) {
                if (jsonData) {
                    var matchClassCallback = function (error, jsonData) {
                        if (jsonData) {
                            var newAssoc = new AssocMasterToClass({
                                instId: jsonData.instId,
                                masterId: authId,
                                classId: classId,
                                assocDate: Moment(),
                                assocBy: originId
                            });

                            newAssoc.save().then(function () {
                                return callback(null, 'associated_course_to_class');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            console.log(error);
                            return callback(null, 'course_not_existent');
                        }
                    }

                    Class.getClass(classId, matchClassCallback);
                }
                else {
                    console.log(error);
                    return callback(null, 'auth_not_existent');
                }
            }

            Auth.getAuth(authId, matchAuthCallback);
        }
    }

    this.getAssocMasterToClass(authId, classId, duplicateCheckCallback);
}

exports.getAssocMasterToClass = function(authId, classId, callback) {
    AssocMasterToClass.findOne({ masterId: authId, classId: classId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.removeAssocMasterToClass = function(authId, classId, callback) {
    var associationExistsCallback = function(error, jsonData) {
        if(jsonData) {
            AssocMasterToClass.remove({ masterId: authId, classId: classId }).then(function() {
                return callback(null, 'association_removed');
            }).catch(function(error) {
                console.log(error);
                return callback(null, null);
            });
        }
        else {
            return callback(null, 'association_not_existent');
        }
    }

    this.getAssocMasterToClass(authId, classId, associationExistsCallback);
}

exports.setAssocParentToStudent = function(authId, studentId, callback) {
    var duplicateCheckCallback = function(error, jsonData) {
        if(jsonData) {
            return callback(null, 'association_already_existent');
        }
        else {
            var matchParentCallback = function (error, jsonData) {
                if (jsonData) {
                    var matchStudentCallback = function (error, jsonData) {
                        if (jsonData) {
                            var newAssoc = new AssocMasterToClass({
                                instId: jsonData.instId,
                                masterId: authId,
                                classId: classId,
                                assocDate: Moment(),
                                assocBy: originId
                            });

                            newAssoc.save().then(function () {
                                return callback(null, 'associated_course_to_class');
                            }).catch(function (error) {
                                console.log(error);
                                return callback(null, 'unknown_error');
                            });
                        }
                        else {
                            console.log(error);
                            return callback(null, 'student_not_existent');
                        }
                    }

                    Auth.getAuth(studentId, matchStudentCallback);
                }
                else {
                    console.log(error);
                    return callback(null, 'parent_not_existent');
                }
            }

            Auth.getAuth(authId, matchParentCallback);
        }
    }

    this.getAssocParentToStudent(authId, studentId, duplicateCheckCallback);
}

exports.getAssocParentToStudent = function(authId, studentId, callback) {
    AssocParentToStudent.findOne({ parentId: authId, classId: studentId }).then(function(data) {
        return callback(null, data);
    }).catch(function(error) {
        console.log(error);
        return callback(null, null);
    });
}

exports.removeAssocParentToStudent = function(authId, studentId, callback) {
    var associationExistsCallback = function(error, jsonData) {
        if(jsonData) {
            AssocParentToStudent.remove({ parentId: authId, classId: studentId }).then(function() {
                return callback(null, 'association_removed');
            }).catch(function(error) {
                console.log(error);
                return callback(null, null);
            });
        }
        else {
            return callback(null, 'association_not_existent');
        }
    }

    this.getAssocParentToStudent(authId, studentId, associationExistsCallback);
}
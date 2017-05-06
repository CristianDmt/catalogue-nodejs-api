app.controller('Director', function($scope, $rootScope, $routeParams, $http, $api, $cookies, $mdDialog, $mdToast) {
    $scope.demoId = 69;

    $scope.requestAccept = function(reqId) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('You have accepted Cristian Dumitrov\'s request.')
                .hideDelay(1500)
                .position('right bottom')
                .action('Undo')
                .highlightAction(true)
        ).then(function(response) {
            if(response == 'ok') {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('Undo Request')
                        .textContent('Are you sure you want to remove Cristian Dumitrov from your institution?')
                        .ariaLabel('Remove from Institution')
                        .ok('Close')
                );
            }
        });
    }

    $scope.requestDeny = function(reqId) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('You have denied Cristian Dumitrov\'s request.')
                .hideDelay(1500)
                .position('right bottom')
        ).then(function(response) {});
    }

    $scope.listPermissions = function() {
        $http.get(
            $api.protocol + '://' + $api.endpoint + '/permission/institution/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token')
        ).then(function(res) {
            $scope.permissions = res.data.data;
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.updatePermissions = function(auth, newPermissions) {
        $http.post($api.protocol + '://' + $api.endpoint + '/permission/update/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
            auth: auth.authId,
            access: newPermissions
        }).then(function(res) {
            if(res.data.status == 'ok') {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('The user\'s permissions have been successfully updated.')
                        .hideDelay(1500)
                        .position('right bottom')
                );

                auth.access = newPermissions;
            }
            else if(res.data.status == 'error') {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('The user\'s permissions could not be updated.')
                        .hideDelay(1500)
                        .position('right bottom')
                );
            }
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.removePermissions = function(auth) {
        $mdDialog.show(
            $mdDialog.confirm()
            .title('Remove from Institution')
            .textContent('Are you sure you want to remove ' + auth.authName + ' from the institution?')
            .ariaLabel('Remove Member')
            .ok('Yes')
            .cancel('Cancel')
        ).then(function() {
            $http.post($api.protocol + '://' + $api.endpoint + '/permission/remove/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                auth: auth.authId
            }).then(function(res) {
                if(res.data.status == 'ok') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have successfully removed the user from the institution.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                    $scope.permissions.splice($scope.permissions.indexOf(auth, 1));
                }
                else if(res.data.status == 'error') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('The user could not be removed from the institution.')
                        .hideDelay(1500)
                        .position('right bottom')
                    );
                }

            }, function(res) {
                $location.url('/error');
            });
        }, function() {});
    }

    $scope.createClass = function() {
        $scope.createClassForm.$setSubmitted();

        if($scope.createClassForm.$valid) {
            $http.post($api.protocol + '://' + $api.endpoint + '/class/create/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                name: $scope.class.name,
            }).then(function (res) {
                if (res.data.status == 'ok') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('The class has been successfully created.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                    $scope.class.name = '';
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('The class could not be created.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                }

            }, function (res) {
                $location.url('/error');
            });
        }
    }

    $scope.listClasses = function() {
        $http.get(
            $api.protocol + '://' + $api.endpoint + '/class/list/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token')
        ).then(function(res) {
            var middleArray = res.data.data.length%2 == 0 ? res.data.data.length/2 : res.data.data.length/2 + 1;
            $scope.classesLeft = res.data.data.slice(0, middleArray);
            $scope.classesRight = res.data.data.slice(middleArray, res.data.data.length);
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.createCourse = function() {
        $scope.createCourseForm.$setSubmitted();

        if($scope.createCourseForm.$valid) {
            $http.post($api.protocol + '://' + $api.endpoint + '/course/create/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                name: $scope.course.name,
            }).then(function (res) {
                if (res.data.status == 'ok') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('The course has been successfully created.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                    $scope.course.name = '';
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('The course could not be created.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                }

            }, function (res) {
                $location.url('/error');
            });
        }
    }

    $scope.listCourses = function() {
        $http.get(
            $api.protocol + '://' + $api.endpoint + '/course/list/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token')
        ).then(function(res) {
            var middleArray = res.data.data.length%2 == 0 ? res.data.data.length/2 : res.data.data.length/2 + 1;
            $scope.coursesLeft = res.data.data.slice(0, middleArray);
            $scope.coursesRight = res.data.data.slice(middleArray, res.data.data.length);
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.loadCourseSettings = function() {
        $scope.listCourseTeachers();
        $scope.listCourseTeachersAvailable();
    }

    $scope.listCourseTeachers = function() {
        $http.post(
            $api.protocol + '://' + $api.endpoint + '/assoc/list/teacher/by/course/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                course: $routeParams.course
            }
        ).then(function(res) {
            $scope.teachers = res.data.data;
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.listCourseTeachersAvailable = function() {
        $http.post(
            $api.protocol + '://' + $api.endpoint + '/permission/institution/personal/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                course: $routeParams.course
            }
        ).then(function(res) {
            $scope.teachersAvailable = res.data.data;
            console.log($scope.teachersAvailable);
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.assocTeacherToCourse = function(teacher) {
        $mdDialog.show(
            $mdDialog.confirm()
                .title('Associate Teacher to Course')
                .textContent('Are you sure you want to associate ' + teacher.authName + ' to this course?')
                .ariaLabel('Associate Member')
                .ok('Yes')
                .cancel('Cancel')
        ).then(function() {
            $http.post($api.protocol + '://' + $api.endpoint + '/assoc/make/teacher/by/course/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                teacher: teacher.authId,
                course: $routeParams.course
            }).then(function(res) {
                if(res.data.status == 'ok') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have successfully associated the teacher to the course.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );

                    $scope.listCourseTeachers();
                }
                else if(res.data.status == 'error') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('The action could not be completed.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                }

            }, function(res) {
                $location.url('/error');
            });
        }, function() {});
    }

    $scope.dissocTeacherFromCourse = function(teacher) {
        $mdDialog.show(
            $mdDialog.confirm()
                .title('Remove Teacher from Course')
                .textContent('Are you sure you want to remove ' + teacher.authName + ' from this course?')
                .ariaLabel('Associate Member')
                .ok('Yes')
                .cancel('Cancel')
        ).then(function() {
            $http.post($api.protocol + '://' + $api.endpoint + '/assoc/remove/teacher/from/course/' + $rootScope.selectedInstitution + '?token=' + $cookies.get('token'), {
                teacher: teacher.authId,
                course: $routeParams.course
            }).then(function(res) {
                if(res.data.status == 'ok') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have successfully removed the teacher from the course.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );

                    $scope.listCourseTeachers();
                }
                else if(res.data.status == 'error') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('The action could not be completed.')
                            .hideDelay(1500)
                            .position('right bottom')
                    );
                }

            }, function(res) {
                $location.url('/error');
            });
        }, function() {});
    }
});
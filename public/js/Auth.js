app.controller('Auth', function($scope, $rootScope, $http, $route, $location, $cookies, $api, $mdDialog, $mdToast) {
    $scope.auth = {};
    $scope.inst = {};

    $scope.authLogin = function() {
        $scope.loginAuth.$setSubmitted();

        if($scope.loginAuth.$valid) {
            $http.post($api.protocol + '://' + $api.endpoint + '/auth/request', {
                username: $scope.auth.username,
                password: $scope.auth.password
            }).then(function (res) {
                if (res.data.token) {
                    $cookies.put('token', res.data.token);
                    $rootScope.isAuth = true;
                    $location.url('/');
                    $scope.$emit('eventReloadInstitutions');
                    $route.reload();
                }
                else {
                    $location.url('/login');
                }
            }, function (res) {
                $location.url('/login');
            });
        }
    }

    $scope.authRegister = function() {
        $scope.registerAuth.username.$setValidity('taken', true);
        $scope.registerAuth.$setSubmitted();

        if($scope.registerAuth.$valid) {
            $http.post($api.protocol + '://' + $api.endpoint + '/auth/create', {
                username: $scope.auth.username,
                password: $scope.auth.password,
                name: $scope.auth.name
            }).then(function (res) {
                if (res.data.response == 'auth_created') {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Your account has been created succesufully.')
                            .hideDelay(3000)
                            .position('right bottom')
                    );
                    $location.url('/login');
                }
                else if (res.data.response == 'auth_taken_username') {
                    $scope.registerAuth.username.$setValidity('taken', false);
                }
            }, function (res) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('Error')
                        .textContent('An unknown error has occured. Please try again.')
                        .ariaLabel('Unknown Error')
                        .ok('Close')
                );
            });
        }
    }

    $scope.createInstitution = function() {
        $scope.createInst.$setSubmitted();

        if($scope.createInst.$valid) {
            $http.post($api.protocol + '://' + $api.endpoint + '/institution/create?token=' + $cookies.get('token'), {
                name: $scope.inst.name,
            }).then(function (res) {
                if (res.data.data.id) {
                    $location.url('/institution/' + res.data.data.id);
                    $scope.$emit('eventReloadInstitutions');
                }
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Error')
                            .textContent('An unknown error has occured. Please try again.')
                            .ariaLabel('Unknown Error')
                            .ok('Close')
                    );
                }

            }, function (res) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('Error')
                        .textContent('An unknown error has occured. Please try again.')
                        .ariaLabel('Unknown Error')
                        .ok('Close')
                );
            });
        }
    }

    $scope.listInstitutions = function() {
        $http.get(
            $api.protocol + '://' + $api.endpoint + '/institution/list?token=' + $cookies.get('token')
        ).then(function(res) {
            var middleArray = res.data.data.length%2 == 0 ? res.data.data.length/2 : res.data.data.length/2 + 1;
            $scope.instLeft = res.data.data.slice(0, middleArray);
            $scope.instRight = res.data.data.slice(middleArray, res.data.data.length);
        }, function(res) {
            $location.url('/error');
        });
    }

    $scope.makeRequest = function(inst) {
        $http.get(
            $api.protocol + '://' + $api.endpoint + '/request/make/' + inst._id + '?token=' + $cookies.get('token')
        ).then(function(res) {
            if(res.data.status == 'ok') {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Your request has been successfully sent.')
                        .hideDelay(3000)
                        .position('right bottom')
                );
            }
        }, function(res) {
            $location.url('/error');
        });
    }
});
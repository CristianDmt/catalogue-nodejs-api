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
});
app.controller('Auth', function($scope, $http, $location, $cookies, $api) {
    $scope.auth = {};

    $scope.authLogin = function() {
        $http.post($api.protocol + '://' + $api.endpoint + '/auth/request', {
            username: $scope.auth.username,
            password: $scope.auth.password
        }).then(function(res) {
            if(res.data.token) {
                $cookies.put('token', res.data.token);
                $location.url('/');
            }
            else {
                $location.url('/login');
            }
        }, function(res) {
            $location.url('/login');
        });
    }

    $scope.authRegister = function() {
        $http.post($api.protocol + '://' + $api.endpoint + '/auth/create', {
            username: $scope.auth.username,
            password: $scope.auth.password
        }).then(function(response) {
            if(res.data.token) {
                $location.url('/');
            }
            else {
                $location.url('/login#error');
            }

        }, function(res) {
            $location.url('/login#error');
        });
    }
});
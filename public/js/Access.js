app.controller('AccessController', function($scope, $rootScope, $http, $route, $location, $cookies, $api) {
    $rootScope.isAuth = false;
    $scope.accessInstitutions = {};
    $scope.currentInstitution = '';
    $rootScope.selectedInstitution = '';
    $rootScope.selectedInstitutionAccess = '';

    $rootScope.$on('eventReloadInstitutions', function(event) {
        $http.get($api.protocol + '://' + $api.endpoint + '/permission/available?token=' + $cookies.get('token')).then(function(res) {
            $scope.accessInstitutions = res.data.data;
        }, function(res) {
            console.log('API Error: Could not load user institutions.');
        });
    });

    if($cookies.get('token')) {
        $http.get($api.protocol + '://' + $api.endpoint + '/auth/validate/' + $cookies.get('token')).then(function (res) {
            if(res.data.response == 'token_valid') {
                $rootScope.isAuth = true;

                $http.get($api.protocol + '://' + $api.endpoint + '/permission/available?token=' + $cookies.get('token')).then(function(res) {
                    $scope.accessInstitutions = res.data.data;
                }, function(res) {
                    console.log('API Error: Could not load user institutions.');
                });
            }
            else {
                $location.url('/login');
            }

        }, function (res) {
            $location.url('/login');
        });
    }
    else {
        $location.url('/login');
    }

    $scope.clearInstitution = function(ev) {
        $rootScope.selectedInstitution = '';
        $rootScope.selectedInstitutionAccess = '';
        $location.url('/');
        $route.reload();
    }

    $scope.changeInstitution = function(ev) {
        if(typeof($scope.currentInstitution) == 'object') {
            $rootScope.selectedInstitution = $scope.currentInstitution.instId;
            $rootScope.selectedInstitutionAccess = $scope.currentInstitution.access.toLowerCase();
            $route.reload();
            console.log('Switched To: ' + $rootScope.selectedInstitutionAccess + ' @ ' + $rootScope.selectedInstitution);
        }
    }
});
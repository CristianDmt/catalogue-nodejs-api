var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngAria', 'ngSanitize', 'ngCookies', 'ngMdIcons']);

app.factory('$api', function() {
    return {
        protocol: 'http',
        endpoint: 'localhost:3000/api',
        app: 'localhost:3000'
    }
});

app.controller('MainController', function($templateCache) {
    $templateCache.removeAll();
});

app.controller('AccessController', function($scope, $rootScope, $http, $location, $cookies, $api, $mdSidenav) {
    $rootScope.isAuth = false;
    $scope.accessInstitutions = {};
    $scope.currentInstitution = '';

    if($cookies.get('token')) {
        $http.get($api.protocol + '://' + $api.endpoint + '/auth/validate/' + $cookies.get('token')).then(function (res) {
            if(res.data.response == 'token_valid') {
                $rootScope.isAuth = true;

                $http.get($api.protocol + '://' + $api.endpoint + '/search').then(function(res) {
                    $scope.accessInstitutions = res.data.data;
                }, function(res) {

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

    $scope.showOption = function(ev) {
        console.log($scope.currentInstitution);
    }

    $scope.toggle = function() {
        $mdSidenav('sidenav').toggle();
    }
});

app.controller('InterfaceController', function($scope, $http, $mdMenu) {
    $scope.searchText = '';

    $scope.openAccountMenu = function($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    $scope.openNotificationsMenu = function($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    $scope.querySearch = function() {
        var promise = $q.defer();
        return $http.post('/api/search', {
            query: $scope.searchText
        }).then(function success(res) {
            if(res.data.status == 'error') {
                return {};
            }

            console.log(res.data);

            if(!res.data.data) {
                return {};
            }

            return res.data.data;
        }, function error(res) {
            if(res.data.status == 'error') {
                return {};
            }
        });
    }
});

app.config(function($routeProvider, $locationProvider, $qProvider, $mdThemingProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainController'
            //templateUrl: '/render/home'
        })

        .when('/login', {
            controller: 'Auth',
            templateUrl: '/template/login'
        })

        .when('/register', {
            controller: 'Auth',
            templateUrl: '/template/register'
        })

        .when('/demo/3', {
            controller: 'MainController',
            templateUrl: '/template/demo/3'
        })

        .when('/parent/student/list', {
            controller: 'Parent',
            templateUrl: '/template/parent/student/list'
        })

        .when('/parent/student/situation/:id', {
            controller: 'Parent',
            templateUrl: '/template/parent/student/situation'
        })

        .when('/student/situation', {
            controller: 'Student',
            templateUrl: '/template/student/situation'
        })

        .when('/institution/permissions', {
            controller: 'Principle',
            templateUrl: '/template/institution/permissions'
        })

        .when('/institution/associations', {
            controller: 'Principle',
            templateUrl: '/template/institution/associations'
        })

        .when('/institution/requests', {
            controller: 'Principle',
            templateUrl: '/template/institution/requests'
        })

        .when('/institution/settings', {
            controller: 'Principle',
            templateUrl: '/template/institution/settings'
        });

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('mainTheme').primaryPalette('deep-purple');
    $mdThemingProvider.setDefaultTheme('mainTheme');

    $qProvider.errorOnUnhandledRejections(false);
});
var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngAria', 'ngSanitize', 'ngMdIcons']);

app.factory('$apiProvider', function() {
    return {
        getEndpoint: function() {
            return {
                protocol: 'http',
                api: 'api.localhost',
                app: 'localhost'
            }
        }
    }
});

app.controller('MainController', function($templateCache, $apiProvider) {
    $templateCache.removeAll();
    console.log($apiProvider.getEndpoint());
});

app.controller('InterfaceController', function($scope, $http, $mdSidenav) {
    $scope.searchText = '';

    $scope.toggle = function() {
        $mdSidenav('sidenav').toggle();
    }

    $scope.querySearch = function(query) {
        $http.post('/api/search', {
            query: query
        }).then(function(res) {
            if(res.data.status == 'error') {
                alert('An error has occured. Please ensure you have set a title and an author.');
            }

            console.log(res.data);

            if(!res.data) {
                return [];
            }

            return res.data;
        }, function(res) {
            if(res.data.status == 'error') {
                alert('An error has occured. Please ensure you have set a title and an author.');
            }
        });
    }
})

app.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainController'
            //templateUrl: '/render/home'
        })

        .when('/demo/1', {
            controller: 'MainController',
            templateUrl: '/template/demo/1'
        })

        .when('/demo/2', {
            controller: 'MainController',
            templateUrl: '/template/demo/2'
        })

        .when('/demo/3', {
            controller: 'MainController',
            templateUrl: '/template/demo/3'
        })

        .when('/demo/4', {
            controller: 'MainController',
            templateUrl: '/template/demo/4'
        })

        .when('/parent/student/list', {
            controller: 'Parent',
            templateUrl: '/template/parent/student/list'
        })

        .when('/parent/student/situation/:id', {
            controller: 'Parent',
            templateUrl: '/template/parent/student/situation'
        });

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('mainTheme').primaryPalette('deep-purple');
    $mdThemingProvider.setDefaultTheme('mainTheme');
});
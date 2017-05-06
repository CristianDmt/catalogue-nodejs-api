var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngAria', 'ngSanitize', 'ngCookies', 'ngMdIcons', 'ngMessages']);

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

app.config(function($routeProvider, $locationProvider, $qProvider, $mdThemingProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainController',
            templateUrl: '/template/home'
        })

        .when('/login', {
            controller: 'Auth',
            templateUrl: '/template/login'
        })

        .when('/register', {
            controller: 'Auth',
            templateUrl: '/template/register'
        })

        .when('/account/settings', {
            controller: 'Auth',
            templateUrl: '/template/auth/settings'
        })

        .when('/institution/create', {
            controller: 'Auth',
            templateUrl: '/template/institution/create'
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

        .when('/institutions/all', {
            controller: 'Auth',
            templateUrl: '/template/institutions/all'
        })

        .when('/institution/class/:class', {
            controller: 'Director',
            templateUrl: '/template/institution/class'
        })

        .when('/institution/classes', {
            controller: 'Director',
            templateUrl: '/template/institution/classes'
        })

        .when('/institution/classes/create', {
            controller: 'Director',
            templateUrl: '/template/institution/classes/create'
        })

        .when('/institution/course/:course', {
            controller: 'Director',
            templateUrl: '/template/institution/course'
        })

        .when('/institution/courses', {
            controller: 'Director',
            templateUrl: '/template/institution/courses'
        })

        .when('/institution/courses/create', {
            controller: 'Director',
            templateUrl: '/template/institution/courses/create'
        })

        .when('/institution/permissions', {
            controller: 'Director',
            templateUrl: '/template/institution/permissions'
        })

        .when('/institution/associations', {
            controller: 'Director',
            templateUrl: '/template/institution/associations'
        })

        .when('/institution/requests', {
            controller: 'Director',
            templateUrl: '/template/institution/requests'
        })

        .when('/institution/settings', {
            controller: 'Director',
            templateUrl: '/template/institution/settings'
        })

        .when('/mark/create', {
            controller: 'Teacher',
            templateUrl: '/template/institution/requests'
        })

        .when('/marks/view/:student', {
            controller: 'Teacher',
            templateUrl: '/template/marks/view'
        })
    ;

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('mainTheme').primaryPalette('deep-purple');
    $mdThemingProvider.setDefaultTheme('mainTheme');

    $qProvider.errorOnUnhandledRejections(false);
});
app.controller('InterfaceController', function($scope, $rootScope, $http, $cookies, $location, $mdMenu, $mdSidenav, $mdDialog, $mdToast) {
    $scope.searchText = '';

    $scope.toggle = function() {
        $mdSidenav('sidenav').toggle();
    }

    $scope.openAccountMenu = function($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    $scope.openNotificationsMenu = function($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    $scope.querySearch = function() {
        $http.post('/api/search', {
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

    $scope.authLogout = function() {
        $mdDialog.show(
            $mdDialog.confirm()
                .title('Are you sure you want to logout?')
                .textContent('Any unsaved progress will be lost.')
                .ariaLabel('Logout')
                .ok('Yes')
                .cancel('Cancel')
        ).then(function() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('You have been logged out.')
                    .hideDelay(1500)
                    .position('right bottom')
            );

            $location.url('/login');
            $cookies.remove('token');
            $rootScope.isAuth = false;
        }, function () {});
    }
});
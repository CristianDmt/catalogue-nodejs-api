app.controller('Director', function($scope, $rootScope, $http, $api, $cookies, $mdDialog, $mdToast) {
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
        }, function() {})
    }
});
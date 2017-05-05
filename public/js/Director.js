app.controller('Principle', function($scope, $http, $mdDialog, $mdToast) {
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
});
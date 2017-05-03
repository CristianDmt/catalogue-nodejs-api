app.controller('Parent', function($scope, $http, $mdDialog, $mdToast) {
    $scope.removeStudent = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove this student from your list?')
            .textContent('Removing a student from your list will make you unable to view their school situation and will require the school to associate you again if you change your mind.')
            .ariaLabel('Remove Student')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            // TODO: Server stuff.
            $mdToast.show(
                $mdToast.simple()
                    .textContent('The student has been removed from your list.')
                    .hideDelay(1500)
                    .position('right bottom')
                    .action('Close')
                    .highlightAction(true)
            ).then(function(response) {
                if(response == 'ok') {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('Closed')
                        .textContent('You have closed the dialog.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Close')
                    );
                }
            });

        }, function() {
            // Nothing to do here.
        });
    };
});